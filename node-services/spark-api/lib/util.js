'use strict';

var k12 = require('k-12'),
    assert = require('assert');

/** @module util */


/**
 * A helper function to generate random numbers and pick random (un)weighted values from a set of values
 *
 * @example
 * // returns a random number between min and max (defaults to 0,100 if called with no arguments)
 * rnd(min,max)
 *
 * @example
 * // returns a random value from array (evenly weighted)
 * rnd(['a', 'b', 'c'])
 *
 * @example
 * // returns a random value key weighted by val (win: 89%, mac: %9, lin: 2%)
 * rnd({win: .89,  mac: .09 , lin: .02})
 *
 * @example
 * // returns a random truthy/falsey value (50/50)
 * rnd(0,1)
 *
 * @example
 * // returns a random boolean value (50/50)
 * rnd([true, false])
 *
 * @example
 * // returns 'pizza' (1:2) 'chicken fingers' (1:4) or 'cheese streak' (1:4)
 * rnd({'pizza': .5, 'chicken fingers': .25, 'cheese steak': .25})
 *
 * @alias module:util.rnd
 *
 * @param {Object|Array|Number} a
 * @param {Number} b
 * @returns {Number|String|Boolean|Array|Object} randomValue
 */
function rnd(a, b) {
    // Calling rnd() with no arguments is identical to rnd(0, 100)
    a = a || 0;
    b = b || 100;

    if (typeof b === 'number' && typeof a === 'number') {
        // rnd(int min, int max) returns integer between min, max
        return (function (min, max) {
            if (min > max) {
                throw new RangeError('expected min <= max; got min = ' + min + ', max = ' + max);
            }
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }(a, b));
    }

    if (Object.prototype.toString.call(a) === '[object Array]') {
        // Returns a random element from array (a), even weighting
        return a[Math.floor(Math.random() * a.length)];
    }

    if (a && typeof a === 'object') {
        // Returns a random key from the passed object; keys are weighted by the decimal probability in their value
        return (function (obj) {
            var rand = rnd(0, 100) / 100, min = 0, max = 0, key, returnVal;

            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    max = obj[key] + min;
                    returnVal = key;
                    if (rand >= min && rand <= max) {
                        break;
                    }
                    min = min + obj[key];
                }
            }

            return returnVal;
        }(a));
    }

    throw new TypeError('Invalid arguments passed to rnd. (' + (b ? a + ', ' + b : a) + ')');
}

/**
 * Returns a copy of an object including only the properties in keys
 *
 * @alias module:util.filterObjectKeys
 *
 * @param {Array} keys
 * @param {Object} obj
 * @returns {Object}
 */
function filterObjectKeys(keys, obj) {
    var filteredObj = {};

    Object
        .keys(obj)
        .filter(function (key) {
            return keys.indexOf(key) !== -1;
        }).forEach(function (key) {
            filteredObj[key] = obj[key];
        });

    return filteredObj;
}


/**
 * Returns a copy of an object including all properties EXCEPT the properties in keys
 *
 * @alias module:util.excludeObjectKeys
 *
 * @param {Array} keys
 * @param {Object} obj
 * @returns {Object}
 */
function excludeObjectKeys(keys, obj) {
    var filteredObj = {};

    Object
        .keys(obj)
        .filter(function (key) {
            return keys.indexOf(key) === -1;
        }).forEach(function (key) {
            filteredObj[key] = obj[key];
        });

    return filteredObj;
}

/**
 * Returns a boolean indicating whether the given string is a number greater than or equal to zero
 *
 * @alias module:util.isGteZero
 *
 * @param {String} str
 * @returns {Boolean}
 */
function isGteZero(str) {
    str = parseInt('' + str, 10);
    return !isNaN(str) && str >= 0;
}

/**
 * Returns a boolean indicating whether the given string is a number greater than zero
 *
 * @alias module:util.isGtZero
 *
 * @param {String} str
 * @returns {Boolean}
 */
function isGtZero(str) {
    str = parseInt('' + str, 10);
    return !isNaN(str) && str > 0;
}


/**
 * Returns a boolean indicating whether the given string contains an ASN ID in the following format:
 * - 56-bit (7 character) hexadecimal numbers prefixed with S (8 characters total)
 *
 * @alias module:util.isAsnId
 *
 * @param {String} code
 * @returns {Boolean}
 */
function isAsnId(code) {
    return (/^S[\dA-F]{7}$/).test('' + code);
}


/**
 * Returns a boolean indicating whether the given string contains a Matchbook ID in the following format:
 * - zero-filled decimal numbers with a maximum value of 9,999,999 prefixed with M (8 characters total)
 *
 * @alias module:util.isMatchbookId
 *
 * @param {String} code
 * @returns {Boolean}
 */
function isMatchbookId(code) {
    // Matchbook IDs are
    return (/^M[\dA-F]{7}$/).test('' + code);
}


/**
 * Returns a boolean indicating whether the given string contains an ASN or Matchbook ID in the following formats:
 * - Matchbook: zero-filled decimal numbers with a maximum value of 9,999,999 prefixed with M (8 characters total)
 * - ASN: 56-bit (7 character) hexadecimal numbers prefixed with S (8 characters total)
 *
 * @alias module:util.isAsnStyleId
 *
 * @param {String} code
 * @returns {Boolean}
 */
function isAsnStyleId(code) {
    return (/^[SM][\dA-F]{7}$/).test('' + code);
}

function toSparkpointId(sparkpoint) {
    var lookup = global.app.context.lookup;

    sparkpoint = '' + sparkpoint;

    if (isAsnId(sparkpoint)) {
        return lookup.shared.standard.idToSparkpointId[sparkpoint];
    }

    return isMatchbookId(sparkpoint) ? sparkpoint : lookup.codeToId('sparkpoint', sparkpoint);
}

function toSparkpointCode(sparkpoint) {
    var lookup = global.app.context.lookup;

    sparkpoint = '' + sparkpoint;

    if (isMatchbookId(sparkpoint)) {
        return lookup.shared.sparkpoint.cache.idToCode[sparkpoint.toLowerCase()];
    }

    if (isAsnId(sparkpoint)) {
        return lookup.shared.sparkpoint.cache.idToCode[lookup.shared.sparkpoint.asnIdToSparkpointIds[sparkpoint][0]];
    }

    return lookup.shared.sparkpoint.cache.idToCode[lookup.shared.sparkpoint.codeToId[sparkpoint.toLowerCase()]];
}

function toSparkpointIds(str) {
    var returnVal = [];

    ('' + str).split(',').forEach(function (sparkpoint) {
        sparkpoint = toSparkpointId(sparkpoint);

        if (sparkpoint) {
            returnVal.push(sparkpoint);
        }
    });

    return returnVal;
}

function toSparkpointCodes(str) {
    var returnVal = [];

    ('' + str).split(',').forEach(function (sparkpoint) {
        sparkpoint = toSparkpointCode(sparkpoint);

        if (sparkpoint) {
            returnVal.push(sparkpoint);
        }
    });

    return returnVal;
}

function toAsnId(asnId) {
    var lookup = global.app.context.lookup;

    asnId = '' + asnId;

    if (isAsnId(asnId)) {
        return asnId;
    }

    return lookup.shared.standard.codeToId[asnId];
}

function toStandardCode(standardCode) {
    var lookup = global.app.context.lookup;
    
    standardCode = '' + standardCode;

    if (isAsnId(standardCode)) {
        return lookup.shared.standard.cache.idToCode[standardCode];
    }

    return lookup.shared.standard.cache.idToCode[lookup.shared.standard.cache.codeToId[standardCode.toLowerCase()]];
}

function toAsnIds(str) {
    var returnVal = [];

    ('' + str).split(',').forEach(function (standard) {
        standard = toAsnId(standard);

        if (standard) {
            returnVal.push(standard);
        }
    });

    return returnVal;
}

function toStandardCodes(str) {
    var returnVal = [];

    ('' + str).split(',').forEach(function (standard) {
        standard = toStandardCode(standard);

        if (standard) {
            returnVal.push(standard);
        }
    });

    return returnVal;
}

function requireParams(params, req, res) {

    var missing = params.filter(function (param) {
        return typeof req.params[param] === 'undefined';
    });

    if (missing.length > 0) {
        res.statusCode = 400;
        res.json({
            error: 'Missing required parameter(s): ' + missing.join(', '),
            params: req.params
        });
        return missing;
    }

    return false;
}

function QueryBuilder() {
    this.values = [];
    this.tables = {};
}

QueryBuilder.prototype.push = function push(table, column, value) {
    var idx = this.values.indexOf(value);
    idx = (idx === -1) ? (this.values.push(value) -1) : idx;
    this.tables[table] || (this.tables[table] = {});
    this.tables[table][column] = idx;
    return idx;
};

QueryBuilder.prototype.pop = function pop(tableName, reset) {
    reset = (typeof reset === 'boolean') ? reset : true;

    var table = this.tables[tableName],
        columns = Object.keys(table),
        returnVal = {
            columns: table,
            placeholders: columns.map(key => `$${table[key]+1}`),
            values: columns.map(key => this.values[table[key]]),
            allValues: this.values
        };

    if (reset) {
        delete this.tables[tableName];
    }

    return returnVal;
};

QueryBuilder.prototype.getSet = function getSet(table, constraintColumns) {
    var state = this.pop(table, false),
        setColumns = Object.keys(state.columns).filter(key => constraintColumns.indexOf(key) === -1);

    return setColumns.map(column => `${column} = $${state.columns[column] + 1}`).join(', ');
};

QueryBuilder.prototype.getValues = function getValues(table, order) {
    var state = this.pop(table, false),
    order = order || Object.keys(state.columns);
    return order.map(column => `$${state.columns[column] + 1}`).join(', ');
};

QueryBuilder.prototype.getWhere = function getWhere(table, constraintColumns) {
    var state = this.pop(table, false),
        setColumns = Object.keys(state.columns).filter(key => constraintColumns.indexOf(key) !== -1);
    return setColumns.map(column => `${column} = $${state.columns[column] + 1}`).join(' AND ');
};

QueryBuilder.prototype.getUpsert = function getUpsert(table, constraintColumns, reset) {
    var values = this.getValues(table),
        set = this.getSet(table, constraintColumns),
        columns = Object.keys(this.pop(table, reset).columns);

    if (constraintColumns.length === 1 &&
        constraintColumns[0] === 'id' &&
        columns.indexOf('id') === -1
    ) {
        values += (`, nextval('${table}_id_seq')`);
        columns.push('id');
    }

    return `INSERT INTO ${table} (${columns.join(', ')}) VALUES(${values}) ON CONFLICT(${constraintColumns.join(', ')}) DO UPDATE SET ${set} RETURNING *`;
};

function generateSet(keys, placeholders, constraintKeys) {
    constraintKeys = constraintKeys || [];
    return 'SET ' + keys.filter(function(key) {
            return constraintKeys.indexOf(key) === -1;
        }).map(function(key, i) {
            return `${key} = ${placeholders[i]}`
        }).join(', ');
}

function* groupQueries(queries, values, records, ctx, excludeKeys) {
    var cteQuery = [],
        selectQuery = ['SELECT result FROM ('],
        results;

    excludeKeys = excludeKeys || [];

    queries.forEach(function (query, idx) {
        var first = (++idx === 1);

        cteQuery.push(`${(first ? 'WITH ' : ',')} i${idx} AS (${query})`);

        if (!first) {
            selectQuery.push('UNION ALL');
        }

        selectQuery.push(`  SELECT ${idx} AS sort_order, to_json(i${idx}) AS result FROM i${idx}`)
    });

    selectQuery.push(') s ORDER BY sort_order;');

    results = yield ctx.pgp.tx(function () {
        return this.batch([this.any(cteQuery.join('\n') + '\n' + selectQuery.join('\n'), values)]).catch(function (error) {
            ctx.throw(500, error.getErrors().pop());
        });
    });

    results = results[0].map(result => result.result);

    return records.map(function(record) {
        return Object.assign.apply(null, record.queries.map(function(idx) {
            if (typeof results[idx] === 'object') {
                return excludeObjectKeys(excludeKeys, results[idx]);
            }
        }));
    });
}

function isString(val) {
    return typeof val === 'string';
}

function isDate(val) {
    return new Date(val).toString() !== 'Invalid Date';
}

function allowNull(fn) {
    return function (val) {
        if (val === null) {
            return true;
        } else {
            return fn(val);
        }
    };
}

function getNumericKeys(obj) {
    return (Array.isArray(obj) ? obj : Object.keys(obj)).map(key => parseInt(key, 10)).filter(key => !isNaN(key));
}

function getNonNumericKeys(obj) {
    return (Array.isArray(obj) ? obj : Object.keys(obj)).filter(key => isNaN(key));
}

function validateNumericKeys(obj) {
    var keys = Object.keys(obj),
        numericKeys = getNumericKeys(keys);

    if (keys.length !== numericKeys.length) {
        throw new Error('Keys should be numeric, you passed: ' + getNonNumericKeys(keys).join(','));
    } else {
        return numericKeys;
    }
}

function* identifyRecord(record, lookup) {
    yield identifyRecordEntity(record, 'sparkpoint', lookup);
    yield identifyRecordEntity(record, 'section', lookup);
}

function* identifyRecordEntity(record, entity, lookup) {
    var targetKey = entity + '_id',
        keys = [entity, entity + '_code', targetKey],
        key, passedValue;

    lookup = lookup[entity];

    keys.forEach(function(k) {
        if (record[k] !== undefined)  {
            if (key) {
                throw new Error(`${key} and ${k} conflict as the ${entity} identifier`);
            }

            key = k;
            passedValue = record[k];
        }

        delete record[k];
    });

    if (!(key && passedValue)) {
        return null;
    }

    if (key === entity + '_id') {
        if (yield lookup.idToCode(passedValue)) {
            record[targetKey] = passedValue;
        }
    } else {
        record[targetKey] = yield lookup.codeToId(passedValue);
    }

    return record;
}

function identifyRecordEntitySync(record, entity, lookup) {
    var keys = [entity, entity + '_code', entity + '_id'],
        key, passedValue;

    lookup = lookup[entity];

    if (!lookup || !lookup.cache) {
        throw new Error(`Lookup cache for ${entity} does not exist or is not initialized`);
    }

    keys.forEach(function(k) {
        if (record[k]) {
            if (key) {
                throw new Error(`${key} and ${k} conflict as the ${entity} identifier`);
            }

            key = k;
            passedValue = record[k];
        }
        delete record[k];
    });

    if (!(key && passedValue)) {
        return null;
    }

    if (key === entity + '_id') {
        if (lookup.cache.idToCode[passedValue]) {
            return passedValue;
        }
    } else {
        return lookup.cache.codeToId[('' + passedValue).toLowerCase()];
    }
}

function identifyRecordSync(record, lookup) {
    var sparkpointId, sectionId;

    if (sparkpointId = identifyRecordEntitySync(record, 'sparkpoint', lookup)) {
        record.sparkpoint_id = sparkpointId;
    }

    if (sectionId = identifyRecordEntitySync(record, 'section', lookup)) {
        record.section_id = sectionId;
    }

    return record;
}

function codifyRecord(record, lookup) {
    // If we use this with map, foreach, etc. the second argument will be passed, so we flip the conditional here
    // to use lookup when present on the this object
    lookup = this && this.lookup ? this.lookup : lookup;

    if (record.section_id) {
        record.section_code = lookup.section.cache.idToCode[record.section_id];
    }

    if (record.sparkpoint_id) {
        record.sparkpoint_code = lookup.sparkpoint.cache.idToCode[record.sparkpoint_id];
    }

    return record;
}

function namifyRecord(record, lookup) {
    // If we use this with map, foreach, etc. the second argument will be passed, so we flip the conditional here
    // to use lookup when present on the this object
    lookup = this && this.lookup ? this.lookup : lookup;

    [ 'author_id',
      'teacher_id',
      'recommender_id',
      'user_id',
      'closed_by',
      'student_id',
      'graded_by'
    ].forEach(function(col) {
        var val = record[col];

        if (typeof val === 'number') {
            let propName = col.replace('_id', '_name'),
                userName = lookup.person.idToDisplayName[val];

            if (propName.indexOf('_name') === -1) {
                propName = propName + '_name';
            }

            if (userName) {
                record[propName] = userName;
            }
        }
    });

    return record;
}

function Values(vals) {
    this.vals = vals || [];
}

Values.prototype.push = function(val) {
    var idx = this.vals.indexOf(val);

    if (idx === -1) {
        return '$' + this.vals.push(val);
    } else {
        return '$' + (idx + 1);
    }
};

function selectFromRequest(tableName, vals) {
    var allowedKeys = this.introspection.tables[tableName],
        limit = parseInt(this.query.limit, 10),
        offset = parseInt(this.query.offset, 10),
        sql = `SELECT * FROM ${tableName}`,
        where = [],
        query;

    vals = vals || new Values();

    if (isNaN(limit)) {
        limit = 'ALL';
    }

    if (isNaN(offset)) {
        offset = 0;
    }

    query = identifyRecordSync(this.query, this.lookup);

    for (var key in allowedKeys) {
        let val = query[key];

        if (val !== undefined) {

            // Do not allow student's to query for another student's student id
            if (this.isStudent && key === 'student_id') {
                val = this.userId;
            }

            if (val === 'null' || val === null) {
                where.push(`${key} IS NULL`);
            } else {
                where.push(`${key} = ${vals.push(val)}`);
            }
        }
    }

    if (where.length > 0) {
        sql += ' WHERE '+  where.join(' AND ');
    }

    sql += ` LIMIT ${limit} OFFSET ${offset};`;

    return this.pgp.any(sql, vals.vals);
}

function whereFromRequest(tableName, vals) {
    var allowedKeys = this.introspection.tables[tableName],
        where = [],
        query = identifyRecordSync(this.query, this.lookup)

    for (var key in allowedKeys) {
        let val = query[key];

        if (val !== undefined) {

            // Do not allow student's to query for another student's student id
            if (this.isStudent && key === 'student_id') {
                val = this.userId;
            }

            if (val === 'null' || val === null) {
                where.push(`${key} IS NULL`);
            } else {
                where.push(`${key} = ${vals.push(val)}`);
            }
        }
    }

    if (where.length > 0) {
       return ' WHERE '+  where.join(' AND ');
    }

    return '';
}

function recordToWhere(record, vals) {
    var keys = Object.keys(record),
        values = keys.map(col => vals.push(record[col])),
        where = keys.map(function(key, i) {
            let val = values[i];

            if (val === null) {
                return `${key} IS NULL`;
            } else {
                return `${key} = ${val}`;
            }
        });

    return 'WHERE ' + where.join(' AND ');
}

function recordToInsert(tableName, record, vals) {
    // allowedKeys must be an array of column names for the table
    var allowedKeys = Object.keys(this.introspection.tables[tableName]),
        // primary keys must be an array of the column(s) that make up the primary key
        primaryKeys = this.introspection.primaryKeys[tableName].columns,
        conflictColumns = [],
        conflictPlaceholders = [],
        valueColumns = [],
        valuePlaceholders = [],
        sql = `INSERT INTO ${tableName} `;

    allowedKeys.forEach(function (col) {
        let val = record[col],
            placeholder = vals.push(val);

        if (val !== undefined) {
            if (primaryKeys.indexOf(col) !== -1) {
                conflictColumns.push(col);
                conflictPlaceholders.push(placeholder);
            }

            valuePlaceholders.push(placeholder);
            valueColumns.push(col);
        }
    });

    sql += `(${valueColumns.join(', ')}) VALUES (${valuePlaceholders.join(', ')})`;

    // Generate an upsert
    if (conflictColumns.length > 0) {
        sql += ` ON CONFLICT (${conflictColumns.join(', ')}) DO UPDATE SET `;
        sql += valueColumns.map(function(col, i) {
            return `${col} = ${valuePlaceholders[i]}`;
        }).join(', ');
    }

    return sql;
}

function recordToUpsert(tableName, record, vals, _conflictColumns) {
    // allowedKeys must be an array of column names for the table
    var allowedKeys = Object.keys(this.introspection.tables[tableName]),
        primaryKeys = this.introspection.primaryKeys[tableName].columns,
        conflictColumns = [],
        conflictPlaceholders = [],
        valueColumns = [],
        valuePlaceholders = [],
        sql = `INSERT INTO ${tableName} `;

    allowedKeys.forEach(function (col) {
        let val = record[col],
            placeholder = vals.push(val);

        if (val !== undefined) {
            if (_conflictColumns.indexOf(col) !== -1 || primaryKeys.indexOf(col) !== -1) {
                conflictColumns.push(col);
                conflictPlaceholders.push(placeholder);
            }

            valuePlaceholders.push(placeholder);
            valueColumns.push(col);
        }
    });

    // Make sure that all of the columns specified in conflictColumns exist in the passed record, if not throw
    if (conflictColumns.length < _conflictColumns.length) {
        let missingCols = _conflictColumns.filter(col => record[col] === undefined);

        throw new Error(
            `An UPSERT for a ${tableName} record is missing values for the following ON CONFLICT columns: ${missingCols}`
        );
    }

    sql += `(${valueColumns.join(', ')}) VALUES (${valuePlaceholders.join(', ')})`;

    // Generate an upsert
    if (conflictColumns.length > 0) {
        sql += ` ON CONFLICT (${conflictColumns.join(', ')}) DO UPDATE SET `;

        // Do not include conflict columns or PKs in the SET values
        sql += valueColumns.map(function(col, i) {
            if (conflictColumns.indexOf(col) !== -1) {
                return null;
            }

            return `${col} = ${valuePlaceholders[i]}`;
        }).filter(sql => sql !== null).join(', ');
    }

    return sql;
}

function recordToUpdate(tableName, record, vals) {
    var allowedKeys = Object.keys(this.introspection.tables[tableName]),
        primaryKeys = this.introspection.primaryKeys[tableName].columns,
        where = [],
        sets = [];

    allowedKeys.forEach(function (col) {
        let val = record[col];

        if (primaryKeys.indexOf(col) === -1) {
            if (val !== undefined) {
                sets.push(`${col} = ${vals.push(val)}`);
            }
        } else {
            if (val === undefined) {
                throw new Error(`An UPDATE for a ${tableName} record is missing a value for the primary key ${col}`);
            }

            where.push(`${col} = ${vals.push(val)}`);
        }
    });

    return `UPDATE ${tableName} SET ${sets.join(', ')} WHERE ${where.join(' AND ')}`;
}

function queriesToReturningCte(queries) {
    var cte = [],
        select = [];

    queries.forEach(function(query, i) {
        query = query.trim();

        // Strip trailing semi-colon
        if (query.slice(-1) === ';') {
            query = query.slice(0, -1);
        }

       if (query.slice(-11).toLowerCase() !== 'returning *') {
           query += ' RETURNING *'
       }

        cte.push(`q${i} AS (${query})`);
        select.push(`SELECT * FROM q${i}`);
    });

    return `WITH ${cte.join(',\n')} ${select.join('\nUNION ALL\n')};`;
}

function queriesToReturningJsonCte(queries) {
    var cte = [],
        select = [];

    queries.forEach(function(query, i) {
        query = query.trim();

        // Strip trailing semi-colon
        if (query.slice(-1) === ';') {
            query = query.slice(0, -1);
        }

        if (query.slice(-11).toLowerCase() !== 'returning *') {
            query += ' RETURNING *'
        }

        cte.push(`q${i} AS (${query})`);
        select.push(`SELECT row_to_json(q${i}) AS json FROM q${i}`);
    });

    return `WITH ${cte.join(',\n')} ${select.join('\nUNION ALL\n')};`;
}

function validateRecordSet(ctx, tableName, records, customRecordFn, customRecordSetFn) {
    var schemaValidator = ctx.validation[tableName],
        validationErrors = [];

    assert(customRecordFn === undefined || typeof customRecordFn === 'function');
    assert(customRecordSetFn === undefined || typeof customRecordSetFn === 'function');

    records = records.map(function (originalRecord) {
        var errors,
            identifiedRecord = identifyRecordSync(originalRecord, ctx.lookup, {});

        if (customRecordFn) {
            customRecordFn(identifiedRecord, errors, originalRecord);
        }

        errors = schemaValidator(identifiedRecord) || [];

        if (errors.length > 0) {
            validationErrors.push({
                input: originalRecord,
                effective: identifiedRecord,
                errors: errors
            });
        }

        return identifiedRecord;
    });

    if (customRecordSetFn) {
        customRecordSetFn(records, validationErrors);
    }

    // Let's bail: on validation errors with a helpful JSON error message
    if (validationErrors.length > 0) {
        ctx.status = 400;

        return ctx.body = {
            success: false,
            error: validationErrors
        };
    }

    return records;
}

module.exports = {
    filterObjectKeys: filterObjectKeys,
    excludeObjectKeys: excludeObjectKeys,
    rnd: rnd,

    allowNull: allowNull,
    isGteZero: isGteZero,
    isGtZero: isGtZero,
    isAsnId: isAsnId,
    isMatchbookId: isMatchbookId,
    isAsnStyleId: isAsnStyleId,
    isDate: isDate,
    isString: isString,

    getNumericKeys: getNumericKeys,
    getNonNumericKeys: getNonNumericKeys,
    validateNumericKeys: validateNumericKeys,

    toSparkpointIds: toSparkpointIds,
    toSparkpointCodes: toSparkpointCodes,
    toSparkpointId: toSparkpointId,
    toSparkpointCode: toSparkpointCode,

    toAsnIds: toAsnIds,
    toStandardCodes: toStandardCodes,
    toAsnId: toAsnId,
    toStandardCode: toStandardCode,

    requireParams: requireParams,
    generateSet: generateSet,
    QueryBuilder: QueryBuilder,
    groupQueries: groupQueries,

    codifyRecord: codifyRecord,
    identifyRecordSync: identifyRecordSync,
    identifyRecord: identifyRecord,
    namifyRecord: namifyRecord,

    Values: Values,

    selectFromRequest: selectFromRequest,
    whereFromRequest: whereFromRequest,
    recordToWhere: recordToWhere,
    recordToUpdate: recordToUpdate,
    recordToInsert: recordToInsert,
    recordToUpsert: recordToUpsert,
    queriesToReturningCte: queriesToReturningCte,
    queriesToReturningJsonCte: queriesToReturningJsonCte,

    validateRecordSet: validateRecordSet,

    bind: require('co-bind'),

    arrayToGradeRange: k12.arrayToGradeRange,
    gradeRangeToArray: k12.gradeRangeToArray
};
