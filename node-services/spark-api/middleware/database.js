'use strict';

var promise = require('bluebird'),
    monitor = require('pg-monitor'),
    options = {
        promiseLib: promise,
        noLocking: true,
        capTX: true
    },
    Pgp = require('pg-promise')(options),
    pgpConnections = {},
    PgpWrapper = require('./../lib/pgp-wrapper.js');

const EXCLUDED_SCHEMAS = ['information_schema', 'pg_catalog', 'spark0', 'spark1', 'slate1', 'slate2'];

function objToConnectionString(obj) {
    return `postgres://${obj.username}:${obj.password}@${obj.host}:5432/${obj.database}?application_name=spark-api`;
}

function initializePgp(config, slateConfig, globalConfig) {
    if (globalConfig.logging && globalConfig.logging.stdout_sql) {
        monitor.attach(options);
        monitor.setTheme('matrix');
    }

    if (config.postgresql && config.postgresql.sharedConnection) {
        pgpConnections.shared = Pgp(objToConnectionString(config.postgresql.sharedConnection));
    }

    (slateConfig.instances || [])
        .filter(instance => instance.postgresql)
        .forEach(instance => pgpConnections[instance.key] = Pgp(objToConnectionString(instance.postgresql)));

    return pgpConnections;
}

function pgp(options) {
    return function *pgp(next) {
        var ctx = this,
            appContext = ctx.app.context,
            schema = ctx.header['x-nginx-mysql-schema'],
            requestId = ctx.headers['x-nginx-request-id'],
            guc;

        appContext.pgp || (appContext.pgp = initializePgp(options.config, options.slateConfig, appContext.config));

        if (schema) {
            ctx._pgp = appContext.pgp[schema];
            ctx.pgp = new PgpWrapper(ctx._pgp, ctx);

            guc = {
                'spark.user_id': ctx.userId,
                'spark.role': ctx.role,
                'spark.request_id': requestId
                application_name: `sark-api_${ctx.username}_${requestId}`
            };
        } else if (ctx.healthcheck) {
            // Do not set GUC for health checks
            ctx._pgp = appContext.pgp.shared;
            ctx.pgp = appContext.pgp.shared;
        } else {
            ctx.throw(new Error('If you are not behind a load balancer; you must pretend to be. See README.md.'), 400);
        }

        if (!ctx.pgp) {
            ctx.throw(new Error(`Unable to initialize pgp.. (Check if ${ctx.schema} is a valid Slate instance)`));
        }

        ctx.sharedPgp = appContext.pgp.shared;

        appContext.introspection || (appContext.introspection = {});

        if (schema) {
            if (appContext.introspection[schema] === undefined) {
                appContext.introspection = {};

                let pgp = pgpConnections[schema];
                let introspection = yield* introspectDatabase.call(ctx, pgp);

                appContext.introspection[schema] = introspection;

                let enums = introspection.enums;
                let tables = introspection.tables;

                appContext.validation || (appContext.validation = {});
                appContext.validation[schema] = {};

                for (let tableName in tables) {
                    let table = tables[tableName];
                    appContext.validation[schema][tableName] = generateValidationFunction(table, enums);
                }
            }

            ctx.validation = appContext.validation[schema];
            ctx.introspection = appContext.introspection[schema];
        }

        ctx.guc = function(obj) {
            if (typeof obj === 'object') {
                Object.assign(guc, obj);
            }

            return Object.keys(guc).map(function(key) {
                return `SET ${key} = '${guc[key]}';\n`;
            }).join('');
        };

        yield next;
    };
}

function* introspectDatabase(pgp) {
    var ctx = this,
        introspectionPath,
        introspection = {},
        cachingEnabled = ctx.app.context.config.caching && ctx.app.context.config.caching.introspection;

    if (cachingEnabled) {
        introspectionPath = require('path').dirname(require.main.filename) + '/cache/introspection.json';

        try {
            introspection.json = require(introspectionPath);
            console.log('Introspection cache hit');
        } catch (e) {
            console.log('Introspection cache miss');
        }
    }

    if (!introspection.json) {
        introspection = yield pgp.one(`
            WITH spark_tables AS (
              SELECT DISTINCT ON (table_name) table_name,
                                 table_schema
                            FROM information_schema.tables
                           WHERE table_schema NOT IN (${EXCLUDED_SCHEMAS.map(s => `'${s}'`).join(', ')})
                             AND table_name NOT LIKE 'fdw_%'
            ), spark_enums AS (
                WITH unique_enums AS (
                    SELECT DISTINCT ON (pg_type.typname)
                           pg_type.typname,
                           pg_type.oid
                      FROM pg_type
                      JOIN pg_enum
                        ON pg_enum.enumtypid = pg_type.oid
                  GROUP BY typname, oid
                ), allowed_values AS (
                    SELECT typname,
                           json_agg(pg_enum.enumlabel)
                      FROM unique_enums
                      JOIN pg_enum
                        ON pg_enum.enumtypid = unique_enums.oid
                  GROUP BY typname
                )
                SELECT typname AS type, json_agg AS allowed_values FROM allowed_values
            ), spark_table_columns AS (
              SELECT st.table_name,
                     json_object_agg(
                        column_name,
                        json_build_object(
                          'type',
                          CASE
                            WHEN data_type = 'USER-DEFINED'
                            THEN udt_name
                            ELSE data_type
                          END,
                          'default_value',
                          column_default,
                          'is_nullable',
                          CASE
                            WHEN is_nullable = 'NO'
                            THEN FALSE
                            ELSE TRUE
                          END,
                          'maximum_length',
                          character_maximum_length
                        )
                     ) AS columns
              FROM information_schema.columns c
              JOIN spark_tables st
                ON st.table_name = c.table_name
               AND st.table_schema = c.table_schema
              GROUP BY st.table_name
            ), spark_primary_keys AS (
              SELECT DISTINCT ON (t.table_name)
                     t.table_name AS table,
                     kcu.constraint_name AS constraint,
                     array_agg(kcu.column_name::TEXT) AS columns
                FROM INFORMATION_SCHEMA.TABLES t
           LEFT JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
                  ON tc.table_catalog = t.table_catalog
                 AND tc.table_schema = t.table_schema
                 AND tc.table_name = t.table_name
                 AND tc.constraint_type = 'PRIMARY KEY'
           LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
                  ON kcu.table_catalog = tc.table_catalog
                 AND kcu.table_schema = tc.table_schema
                 AND kcu.table_name = tc.table_name
                 AND kcu.constraint_name = tc.constraint_name
               WHERE t.table_catalog = 'spark'
                 AND t.table_schema NOT IN (${EXCLUDED_SCHEMAS.map(s => `'${s}'`).join(', ')})
                AND t.table_name NOT LIKE 'fdw_%'
                AND kcu.constraint_name IS NOT NULL
                AND t.table_catalog = 'spark'
           GROUP BY t.table_catalog,
                    t.table_schema,
                    t.table_name,
                    kcu.constraint_name
        ), spark_partitions AS (
            SELECT p.relname AS parent,
                   json_agg(c.relname) AS children
              FROM pg_inherits
              JOIN pg_class AS c
                ON (inhrelid = c.oid)
              JOIN pg_class AS p
                ON (inhparent = p.oid)
          GROUP BY p.relname
        )
    
        SELECT json_build_object(
          'tables',
          json_object_agg(table_name, columns),
          'enums',
          (SELECT json_object_agg(type, allowed_values) FROM spark_enums),
          'primaryKeys',
          (SELECT json_object_agg("table", json_build_object('columns', columns, 'constraint', "constraint")) FROM spark_primary_keys),
          'partitions',
          (SELECT json_object_agg(parent, children) FROM spark_partitions)
        ) AS json FROM spark_table_columns;
        `);

        if (cachingEnabled) {
            require('fs').writeFileSync(introspectionPath, JSON.stringify(introspection.json, null, '\t'));
        }
    }

    return introspection.json;
}

var columnValidators = {
    smallint: function(val) {
        const MIN = -32768;
        const MAX = 32767;

        let num = parseInt(val, 10);

        if (isNaN(num)) {
            return `${val} is not a number`;
        }
        if (num < MIN || num > MAX) {
            return `${val} is out of range for smallint (${MIN} to ${MAX})`;
        }
    },

    integer: function(val) {
        const MIN = -2147483648;
        const MAX = 2147483647;

        let num = parseInt(val, 10);

        if (isNaN(num)) {
            return `${JSON.stringify(val)} is not a number`;
        }
        if (num < MIN || num > MAX) {
            return `${val} is out of range for integer (${MIN} to ${MAX})`;
        }
    },

    character: function (val, col) {
        var len = val.length,
            max = col.maximum_length;

        if (typeof val === 'string' && val.length < max) {
            return `${len} exceeds maximum length of ${max}`;
        }
    },

    boolean: function (val) {
        if (typeof val !== 'boolean') {
            return `${JSON.stringify(val)} is not a boolean`;
        }
    },

    text: function(val) {
        if (typeof val !== 'string') {
            return `${JSON.stringify(val)} is not a string`;
        }
    },

    ARRAY: function (val) {
        if (Array.isArray(val)) {
            return `${JSON.stringify(val)} is not an array`;
        }
    },

    timestamp: function(val) {
        let date = new Date(val);

        if (Object.prototype.toString.call(date) !== '[object Date]' || isNaN(date.getTime())) {
            return `${JSON.stringify(val)} is not a valid date`;
        }
    },

    'timestamp without timezone': function(val) {
        let date = new Date(val);

        if (Object.prototype.toString.call(date) !== '[object Date]' || isNaN(date.getTime())) {
            return `${JSON.stringify(val)} is not a valid date`;
        }
    }
};


function generateValidationFunction(table, enums) {
    var columns = Object.keys(table);

    return function(row) {
        let keys = Object.keys(row),
            errors = keys
                .filter(key => table[key] === undefined)
                .map(key => `${key}: unexpected key, allowed keys are: ${columns.join(', ')}`);

        for (var columnName in table) {
            let column = table[columnName],
                val = row[columnName];

            if (!column.is_nullable && val === undefined && column.default_value === null) {
                errors.push(`${columnName} (${column.type}) is required.`);
            } else if (val !== undefined) {
                let _enum = enums[column.type];

                if (_enum) {
                    if (_enum.indexOf(val) === -1) {
                        errors.push(`${columnName}: Allowed values are: ${_enum.join(', ')}; you gave: ${val}`);
                    }
                } else if (!(column.is_nullable && column === null)) {
                    let validator = columnValidators[column.type];

                    if (validator) {
                        let error = validator(val, column);

                        if (error) {
                            errors.push(columnName + ': ' + error);
                        }
                    }
                }
            }
        }

        if (errors.length === 0) {
            return null;
        } else {
            return errors;
        }
    }
}

module.exports = {
    pgp: pgp,
    pgpConnections: pgpConnections
};