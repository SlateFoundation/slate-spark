'use strict';

var slateCfg = require('../config/slate.json'),
    nats = require('nats'),
    co = require('co'),
    natsCfg = require('../config/nats.json'),
    nc = nats.connect(natsCfg),
    bustSuggestionCache = require('../routes/sparkpoints').bustSuggestionCache,
    util = require('util'),
    shared = {
        standard: {
            entity: 'standard',
            idColumn: 'asn_id',
            customGenerator: function* () {
                // This unrolls non-leaf standards providing a way to get all of the ASN Ids for a standard and its
                // children. This is primarily used for vendor cross walking.
                var idToAsnIds = yield this.pgp.one(`
                    WITH asn_ids AS (
                      SELECT asn_id,
                             ARRAY[asn_id] AS children_ids
                        FROM public.standards
                       WHERE leaf = true
                      UNION
                      SELECT asn_id,
                             children_ids
                        FROM public.standards
                       WHERE leaf = false
                    )
                    SELECT json_object_agg("asn_id", "children_ids") AS json FROM asn_ids;
                `);

                this.idToAsnIds = idToAsnIds.json;
            },
            onCacheBust: bustSuggestionCache
        },

        sparkpoint: {
            entity: 'sparkpoint',
            additionColumns: ['abbreviation'],
            customGenerator: function* () {
                var results = yield this.pgp.any(`SELECT id, code, metadata->>'asn_id' AS asn_id FROM sparkpoints`),
                    self = this;

                this.idToAsnIds || (this.idToAsnIds = {});
                this.codeToAsnIds || (this.codeToAsnIds = {});
                this.asnIdToSparkpointIds || (this.asnIdToSparkpointIds = {});

                shared.standard.idToSparkpointId || (shared.standard.idToSparkpointId = {});

                results.forEach(function (result) {
                    if (result.id && result.code && result.asn_id) {
                        // TODO: This is psuedo support for multiple ASN IDs associated to a single spark point
                        self.idToAsnIds[result.id] = [result.asn_id];
                        self.codeToAsnIds[result.code.toLowerCase()] = result.asn_id;
                        self.asnIdToSparkpointIds[result.asn_id] = [result.id];
                        shared.standard.idToSparkpointId[result.asn_id] = result.id;
                    }
                });
            },
            onCacheBust: bustSuggestionCache
        },

        vendor: require('../legacy/vendor.json')
    },
    perSchool = {
        section: {
            entity: 'course_section',
            idColumn: 'ID',
            codeColumn: 'Code',
            onCacheBust: function* () {
                yield this.pgp.none(`REFRESH MATERIALIZED VIEW "${this.schema}".course_sections`);
            }
        },

        person: {
            entity: 'person',
            tableName: 'people',
            idColumn: 'ID',
            codeColumn: 'Username',
            additionColumns: ['FirstName', 'LastName'],
            customFunction: function(results) {
                var self = this;
                
                results.forEach(function(result) {
                    let displayName = result.FirstName + ' ' + result.LastName;

                    self.idToDisplayName || (self.idToDisplayName = {});
                    self.codeToDisplayName || (self.codeToDisplayName = {});

                    self.idToDisplayName[result.ID] = displayName;
                    self.codeToDisplayName[result.Username] = self.idToDisplayName[result.ID];
                });
            },
            onCacheBust: function* () {
                yield this.pgp.none(`REFRESH MATERIALIZED VIEW "${this.schema}".people`);
            }
        }
    },
    schema =  {},
    initialized = false;

function LookupTable(options) {
    var self = this;

    Object.assign(this, {
        idColumn: 'id',
        codeColumn: 'code',
        populated: false,
        additionalColumns: [],
        autoPopulate: false,
        populating: false,
        schema: 'public',
        autoBust: true,
        onCacheBust: false,
        timeout: null,
        cache: {}
    }, options);

    this.tableName = this.tableName || this.entity + 's';

    if (!this.entity) {
        throw new Error('entity is a required');
    }

    if (this.autoBust) {
        console.log(`Subscribing to: cache.*.${this.schema}.${this.tableName}.*`);

        nc.subscribe(`cache.*.${this.schema}.${this.tableName}.*`, function (msg, reply, subject) {

            var [, action, pk, table, schema] = subject.split('.'),
                event = {
                    type: 'cache',
                    action: action,
                    entity: table,
                    pk: pk,
                    schema: schema
                };

            if (self.timeout) {
                console.log(`Waiting 1s for changes to stop before re-populating ${self.schema}.${self.tableName}...`);
                return;
            }

            self.timeout = setTimeout(function () {
                console.log(`Busting ${self.schema}.${self.tableName} lookup table...`);

                co(function*() {
                    if (self.onCacheBust) {
                        if (self.onCacheBust.constructor.name === 'GeneratorFunction') {
                            yield self.onCacheBust.apply(self, [event]);
                        } else {
                            self.onCacheBust.apply(self, [event]);
                        }
                    }

                    yield self.populate();
                    self.timeout = null;
                });
            });
        });
    }

    if (this.autoPopulate) {
        co(function*() {
            if (!self.populating) {
                yield self.populate();
            }
        });
    }
}

LookupTable.prototype.populate = function* populate (pgp) {
    var {entity, tableName, idColumn, codeColumn, additionalColumns, customFunction, customGenerator, schema, cache} = this,
        columns = [idColumn, codeColumn].concat(additionalColumns),
        columnsQuoted = columns
            .map(column => `"${column}"`)
            .join(','),
        results = yield this.pgp.any(`
            SELECT ${columnsQuoted}
              FROM "${schema}"."${tableName}"
              WHERE "${codeColumn}" IS NOT NULL
        `),
        self = this;

    console.log(`Populating ${schema}.${tableName} lookup table...`);

    // Blow out / initialize lookup tables
    cache.idToCode = {};
    cache.codeToId = {};

    results.forEach(function(result) {
        var id = result[idColumn],
            code = result[codeColumn];

        if (id && code) {
            cache.idToCode[id] = code;
            cache.codeToId[code.toString().toLowerCase()] = id;
        }
    });

    if (customFunction) {
        customFunction.apply(this, [results, columns]);
    }

    if (customGenerator) {
        yield customGenerator.apply(this, [results, columns]);
    }

    console.log(`${schema}.${tableName} populated with ${results.length.toLocaleString()} ${entity}(s).`);
};

LookupTable.prototype.idToCode = function* idToCode(id) {
    var {codeColumn, idColumn, cache} = this,
        cachedCode;

    if (cache.idToCode) {
        cachedCode = cache.idToCode[id];
    }

    if (cachedCode) {
        return cachedCode;
    } else {
        console.log(this);

        let value = yield this.pgp.oneOrNone(
            `SELECT "${codeColumn}" FROM "${this.schema}"."${this.tableName}" WHERE "${idColumn}" = $1 LIMIT 1`,
            [id]
        );

        if (value) {
            let code = value[codeColumn];

            cache.idToCode[id] = code;
            cache.codeToId[code.toString().toLowerCase()] = id;

            return code;
        } else {
            return null;
        }
    }
};

LookupTable.prototype.codeToId = function* codeToId(code) {
    var {codeColumn, idColumn, cache} = this,
        codeKey = code.toString().toLowerCase(),
        cachedCode;

    if (cache.codeToId) {
        cachedCode = cache.codeToId[codeKey];
    }

    if (cachedCode) {
        return cachedCode;
    } else {
        let value = yield this.pgp.oneOrNone(
            `SELECT "${idColumn}" FROM "${this.schema}"."${this.tableName}" WHERE "${codeColumn}" = $1 LIMIT 1`,
            [code]
        );

        if (value) {
            let id = value[idColumn];

            cache.codeToId[codeKey] = id;
            cache.idToCode[id] = code;

            return id;
        } else {
            return null;
        }
    }
};

module.exports = function* (next) {
    // TODO: When lookup references this.app does it leak memory by keeping a reference to this (request context)?

    // Initialize global/shared lookup tables
    if (!initialized) {
        initialized = true;

        for (var entity in shared) {
            if (!(shared[entity] instanceof LookupTable) && shared[entity].entity) {
                shared[entity] = new LookupTable(
                    Object.assign({ pgp: this.app.context.pgp.shared }, shared[entity])
                );

                yield shared[entity].populate();
            }
        }

        let result = yield this.app.context.pgp.shared.one(`
            SELECT json_build_object(
                'idToName',
                (SELECT json_object_agg(id, name) FROM vendors),

                'nameToId',
                (SELECT json_object_agg(lower(name), id) FROM vendors),

                'asnIdToVendorIdentifier',
                (SELECT json_object_agg(id,
                    (SELECT json_object_agg(asn_id, vendor_identifier)
                       FROM vendor_standards_crosswalk
                      WHERE asn_id IS NOT NULL
                        AND vendor_id = vendors.id
                    )
                ) FROM vendors),

                'asnIdToVendorCode',
                (SELECT json_object_agg(id,
                    (SELECT json_object_agg(asn_id, lower(vendor_code))
                       FROM vendor_standards_crosswalk
                      WHERE asn_id IS NOT NULL
                        AND vendor_id = vendors.id
                    )
                ) FROM vendors)
            ) AS json;
        `);

        shared.vendor = result.json;
    }

    if (!(schema[this.schema] instanceof LookupTable)) {
        schema[this.schema] || (schema[this.schema] = {});

        for (let entity in perSchool) {
            schema[this.schema][entity] = new LookupTable(
                Object.assign(
                    { pgp: this.app.context.pgp[this.schema] },
                    perSchool[entity],
                    { schema: this.schema }
                )
            );

            yield schema[this.schema][entity].populate();
        }
    }

    this.lookup = Object.assign(shared, schema[this.schema]);

    this.app.context.lookup || (this.app.context.lookup = {
        shared: shared,
        schema: schema
    });

    yield next;
};
