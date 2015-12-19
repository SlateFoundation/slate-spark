'use strict';

var slateCfg = require('../config/slate.json'),
    legacyLookup = require('./lookup.json'),
    db,
    entities = {
        sparkpoint: {
            arguments: ['sparkpoint', 'sparkpoints', 'id', 'code', ['abbreviation'], function* (lookup) {
                var results = yield db.any(`SELECT id, code, metadata->>'asn_id' AS asn_id FROM sparkpoints`);

                lookup.idToAsnIds || (lookup.idToAsnIds = {});
                lookup.codeToAsnIds || (lookup.codeToAsnIds = {});
                lookup.asnIdToSparkpointIds || (lookup.asnIdToSparkpointIds = {});

                entities.standard.idToSparkpointId || (entities.standard.idToSparkpointId = {});

                results.forEach(function(result) {
                    if (result.id && result.code && result.asn_id) {
                        // TODO: This is psuedo support for multiple ASN IDs associated to a single spark point
                        lookup.idToAsnIds[result.id] = [result.asn_id];
                        lookup.codeToAsnIds[result.code.toLowerCase()] = result.asn_id;
                        lookup.asnIdToSparkpointIds[result.asn_id] = [result.id];
                        entities.standard.idToSparkpointId[result.asn_id] = result.id;
                    }
                });
            }]
        },

        standard: {
            arguments: ['standard', 'standards', 'asn_id', 'code']
        }/*,

        person: {
            arguments: ['person', 'people', 'ID', 'Username', ['FirstName', 'LastName'], function(lookup, results) {
                results.forEach(function(result) {
                    let displayName = result.FirstName + ' ' + result.LastName;
                    lookup.idToDisplayName[result.ID] = displayName;
                    lookup.codeToDisplayName[result.Username] = lookup.idToDisplayName[result.ID];
                });
            }]
        }*/,

        vendor: legacyLookup.vendor
    },
    initialized = false;

const PRODUCTION = process.env.NODE_ENV === 'production';

for (var x = 0, len = slateCfg.instances.length; x < len; x++) {
    let key = slateCfg.instances[x].key;
    entities[key] = { initialized: false };
}

function* populateLookupTable(entity, tableName, idColumn, codeColumn, additionalColumns, customFn) {
    additionalColumns = additionalColumns || [];
    entities[entity] || (entities[entity] = {});

    var columns = [idColumn, codeColumn].concat(additionalColumns),
        results = yield db.any(`SELECT ${columns.map(column => '"' + column + '"').join(',')} FROM ${tableName}`),
        lookup;

    if (typeof entity === 'string') {
        lookup = entities[entity];
    } else {
        lookup = entity;
    }

    lookup.idColumn = idColumn;
    lookup.codeColumn = codeColumn;
    lookup.tableName = tableName;

    lookup.idToCode = lookup.idToCode || {};
    lookup.codeToId = lookup.codeToId || {};

    results.forEach(function(result) {
        var id = result[idColumn],
            code = result[codeColumn];

        if (id && code) {
            lookup.idToCode[id.toString().toLowerCase()] = code;
            lookup.codeToId[code.toString().toLowerCase()] = id;
        }
    });

    if (customFn) {
        yield customFn(lookup, results, columns);
    }
}

function* idToCode(entity, id, schema) {
    var lookup = schema ? entities[schema][entity] : entities[entity],
        idToCode = lookup.idToCode,
        cachedCode;

    if (idToCode) {
        cachedCode = idToCode[id.toString().toLowerCase()];
    }

    if (cachedCode) {
        return cachedCode;
    } else {
        yield db.oneOrNone(
            `SELECT ${lookup.codeColumn} FROM ${lookup.tableName} WHERE ${lookup.idColumn} = $1 LIMIT 1`,
            [id]
        );
    }
}

function* codeToId(entity, code, schema) {
    var lookup = schema ? entities[schema][entity] : entities[entity],
        codeToId = lookup.codeToId,
        cachedCode;

    if (codeToId) {
        cachedCode = codeToId[code.toString().toLowerCase()];
    }

    if (cachedCode) {
        return cachedCode;
    } else {
        yield db.oneOrNone(
            `SELECT ${lookup.idColumn} FROM ${lookup.tableName} WHERE ${lookup.codeColumn} = $1 LIMIT 1`,
            [code]
        );
    }
}

function* codeToDisplayName(entity, code, schema) {
    if (!entities[entity].codeToDisplayName) {
        yield populateLookupTable.call(null, entities.arguments);
    }
}

function* idToDisplayName(entity, id, schema) {
    if (!entities[entity].idToDisplayName) {
        yield populateLookupTable.call(null, entities.arguments);
    }
}

function *initialize(next) {
    if (!initialized) {
        db = this.pgp;
        initialized = true;

        console.log('Initializing lookup tables...');

        for (var entity in entities) {
            if (entities[entity].arguments) {
                console.log(`Populating ${entity} lookup table...`);
                yield populateLookupTable.apply(null, entities[entity].arguments);
            }
        }

        let idToAsnIds = yield db.one(`
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

        entities.standard.idToAsnIds = idToAsnIds.json;
    }

    if (!entities[this.schema].initialized) {
        db = this.pgp;
        entities[this.schema].initialized = true;

        for (var x = 0, len = slateCfg.instances.length; x < len; x++) {
            let key = slateCfg.instances[x].key;

            if (key === this.schema) {
                console.log(`Populating ${key} sections lookup table...`);
                entities[key].section = {};
                yield populateLookupTable.apply(null, [entities[key].section, `"${key}".course_sections`, 'ID', 'Code']);
            }
        }
    }

    yield next;
}

module.exports = {
    initialize: initialize,
    populateLookupTable: populateLookupTable,
    entities: entities,
    idToCode: idToCode,
    codeToId: codeToId,
    idToDisplayName: idToDisplayName,
    codeToDisplayName: codeToDisplayName
};
