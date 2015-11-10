'use strict';

var db = require('./database.js'),
    entities = {
        /*section: {
            arguments: ['section', 'sections', 'ID', 'Code']
        },*/

        sparkpoint: {
            arguments: ['sparkpoint', 'sparkpoints', 'id', 'code', ['abbreviation'], function* (lookup) {
                var results = yield db.any(`SELECT id, code, metadata->>'asn_id' AS asn_id FROM sparkpoints`);

                lookup.idToAsnIds || (lookup.idToAsnIds = {});
                lookup.codeToAsnIds || (lookup.codeToAsnIds = {});
                lookup.asnIdToSparkpointIds || (lookup.asnIdToSparkpointIds = {});

                entities.standard.idToSparkpointId || (entities.standard.idToSparkpointId = {});

                results.forEach(function(result) {
                    if (result.id && result.code && result.asn_id) {
                        lookup.idToAsnIds[result.id.toLowerCase()] = result.asn_id;
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
        }*/
    },
    initialized = false;

function* populateLookupTable(entity, tableName, idColumn, codeColumn, additionalColumns, customFn) {
    additionalColumns = additionalColumns || [];
    entities[entity] || (entities[entity] = {});

    var lookup = entities[entity],
        columns = [idColumn, codeColumn].concat(additionalColumns),
        results = yield db.any(`SELECT ${columns.map(column => '"' + column + '"').join(',')} FROM ${tableName}`);

    lookup.idColumn = idColumn;
    lookup.codeColumn = codeColumn;
    lookup.tableName = tableName;

    lookup.idToCode = lookup.idToCode || {};
    lookup.codeToId = lookup.codeToId || {};

    results.forEach(function(result) {
        var id = result[idColumn],
            code = result[codeColumn];

        if (id && code) {
            lookup.idToCode[id.toLowerCase()] = code;
            lookup.codeToId[code.toLowerCase()] = id;
        }
    });

    if (customFn) {
        yield customFn(lookup, results, columns);
    }
}

function* idToCode(entity, id) {
    var lookup = entities[entity],
        idToCode = lookup.idToCode,
        cachedCode;

    if (idToCode) {
        cachedCode = idToCode[id.toLowerCase()];
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

function* codeToId(entity, code) {
    var lookup = entities[entity],
        codeToId = lookup.codeToId,
        cachedCode;

    if (codeToId) {
        cachedCode = codeToId[code.toLowerCase()];
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

function* codeToDisplayName(entity, code) {
    if (!entities[entity].codeToDisplayName) {
        yield populateLookupTable.call(null, entities.arguments);
    }
}

function* idToDisplayName(entity, id) {
    if (!entities[entity].idToDisplayName) {
        yield populateLookupTable.call(null, entities.arguments);
    }
}

function *initialize(next) {
    if (!initialized) {
        initialized = true;

        console.log('Initializing lookup tables...');

        for (var entity in entities) {
            console.log(`Populating ${entity} lookup table...`);
            yield populateLookupTable.apply(null, entities[entity].arguments);
        }

        yield next;
    } else {
        yield next;
    }
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
