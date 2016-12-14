'use strict';

var co = require('co');

const NANOSECONDS_IN_MS = 1e+6;

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
        natsClient: null,
        pgp: null,
        onCacheBust: false,
        timeout: null,
        cache: {}
    }, options);

    this.tableName = this.tableName || this.entity + 's';

    if (!this.entity) {
        throw new Error('entity is a required');
    }

    if (this.autoBust) {
        let subject = `cache.*.${this.schema}.${this.tableName}.>`;

        if (!this.natsClient) {
            throw new Error('autoBust requires you to pass natsClient in your options to the constructor');
        }

        console.log(`Subscribing to: ${subject}`);

        this.natsClient.subscribe(subject, function (msg, reply, subject) {


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

                let startTime = process.hrtime();

                co(function*() {
                    if (self.onCacheBust) {
                        try {
                            if (self.onCacheBust.constructor.name === 'GeneratorFunction') {
                                yield self.onCacheBust.apply(self, [event]);
                            } else if (typeof self.onCacheBust === 'function') {
                                self.onCacheBust.apply(self, [event]);
                            }
                        } catch (e) {
                            console.error(`onCacheBust handler failed for: ${self.schema}.${self.tableName}`, e);
                        }
                    }

                    yield self.populate();
                    self.timeout = null;
                });

                let duration = process.hrtime(startTime)[1] / NANOSECONDS_IN_MS;
                console.log(`Busted ${self.schema}.${self.tableName} in ${duration} ms`);
            });
        });
    }

    if (this.autoPopulate) {
        if (!this.pgp) {
            throw new Error('autoPopulated requires you to pass pgp in your options the constructor');
        }

        co(function*() {
            if (!self.populating) {
                yield self.populate(this.pgp);
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
        results = yield (pgp || this.pgp).any(`
            SELECT ${columnsQuoted}
              FROM "${schema}"."${tableName}"
              WHERE "${codeColumn}" IS NOT NULL
        `);

    console.log(`Populating ${schema}.${tableName} lookup table...`);

    let startTime = process.hrtime();

    // Blow out / initialize lookup tables
    cache.idToCode = {};
    cache.codeToId = {};

    results.forEach(function(result) {
        var id = result[idColumn],
            code = '' + result[codeColumn];

        if (id && code) {
            cache.idToCode[id] = code;
            cache.codeToId[code.toLowerCase()] = id;
        }
    });

    if (customFunction) {
        customFunction.apply(this, [results, columns]);
    }

    if (customGenerator) {
        yield customGenerator.apply(this, [results, columns]);
    }

    let count = results.length.toLocaleString();
    let duration = process.hrtime(startTime)[1] / NANOSECONDS_IN_MS;

    console.log(`${schema}.${tableName} populated with ${count} ${entity}(s) in ${duration} ms`);

    this.populated = true;
};

LookupTable.prototype.idToCode = function* idToCode(id) {
    var {codeColumn, idColumn, cache} = this,
        cachedCode;

    cache || (cache = {});

    if (cache.idToCode) {
        cachedCode = cache.idToCode[id];
    }

    if (cachedCode) {
        return cachedCode;
    } else {
        let value = yield this.pgp.oneOrNone(
            `SELECT "${codeColumn}" FROM "${this.schema}"."${this.tableName}" WHERE "${idColumn}" = $1 LIMIT 1`,
            [id]
        );

        if (value) {
            let code = '' + value[codeColumn];

            cache.idToCode[id] = code;
            cache.codeToId[code.toLowerCase()] = id;

            return code;
        } else {
            return null;
        }
    }
};

LookupTable.prototype.codeToId = function* codeToId(code) {
    var {codeColumn, idColumn, cache} = this,
        codeKey = ('' + code).toLowerCase(),
        cachedCode;

    cache || (cache = {codeToId: {}, idToCode: {}});

    if (cache.codeToId) {
        cachedCode = cache.codeToId[codeKey];
    }

    if (cachedCode !== undefined) {
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

LookupTable.prototype.toJSON = function() {
    return {
        idColumn: this.idColumn,
        codeColumn: this.codeColumn,
        populated: true,
        additionalColumns: this.additionalColumns,
        autoPopulate: false,
        populating: false,
        schema: this.schema,
        autoBust: this.autoBust,
        onCacheBust: this.onCacheBust,
        cache: this.cache
    };
};

module.exports = LookupTable;
