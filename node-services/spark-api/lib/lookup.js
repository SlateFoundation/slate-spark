'use strict';

var nats = require('nats'),
    co = require('co'),
    // TODO: These should fail gracefully if the configuration file(s) do not exist
    natsCfg = require('../config/nats.json'),
    cachingEnabled = require('../config/caching.json').lookup,
    nc = nats.connect(natsCfg),
    bustSuggestionCache = require('../routes/sparkpoints').bustSuggestionCache,
    util = require('util'),
    cachePath = require('path').join(__dirname, '..', '/cache/lookup.json'),
    LookupTable = require('./LookupTable'),
    shared = {
        standard: {
            entity: 'standard',
            idColumn: 'asn_id',
            customGenerator: function* () {
                // This unrolls non-leaf standards providing a way to get all of the ASN Ids for a standard and its
                // children. This is primarily used for vendor cross walking.
                var idToAsnIds = yield this.pgp.one(/*language=SQL*/ `
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
    },
    perSchool = {
        section: {
            entity: 'course_section',
            idColumn: 'ID',
            codeColumn: 'Code',
            onCacheBust: function* () {
                yield this.pgp.none(`REFRESH MATERIALIZED VIEW CONCURRENTLY "${this.schema}".course_sections`);
            }
        },

        person: {
            entity: 'person',
            tableName: 'people',
            idColumn: 'ID',
            codeColumn: 'Username',
            additionalColumns: ['FirstName', 'LastName'],
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
                yield this.pgp.none(`REFRESH MATERIALIZED VIEW CONCURRENTLY "${this.schema}".people`);
            }
        }
    },
    schema = {},
    initialized = false,
    lookupCache;

try {
    lookupCache = require(cachePath);
    lookupCache.schema || (lookupCache.schema = {});
    console.log('Lookup cache hit');
} catch(e) {
    lookupCache = {
        shared: {},
        schema: {}
    };

    console.log('Lookup cache miss');
}

function* lookup(next) {
    var ctx = this,
        populateYields = [],
        sharedPgp = ctx.app.context.pgp.shared;

    // Initialize global/shared lookup tables
    if (!initialized) {
        initialized = true;

        shared.vendor = sharedPgp.one(/*language=SQL*/ `
            WITH asn_id_to_vendor_identifier AS (
                SELECT
                  vendor_id,
                  json_object_agg(
                      asn_id,
                      vendor_identifier
                  ) AS json
                FROM vendor_standards_crosswalk
                GROUP BY vendor_id
            ), asn_id_to_vendor_code AS (
                SELECT
                  vendor_id,
                  json_object_agg(
                      asn_id,
                      vendor_code
                  ) AS json
                FROM vendor_standards_crosswalk
                GROUP BY vendor_id
            ), vendor_code_to_asn_id AS (
                SELECT
                  vendor_id,
                  json_object_agg(
                      lower(vendor_code),
                      asn_id
                  )
                    AS json
                FROM vendor_standards_crosswalk
                GROUP BY vendor_id
            )
            
            SELECT json_build_object(
                       'asnIdToVendorIdentifier',
                       (SELECT json_object_agg(vendor_id, json)
                        FROM asn_id_to_vendor_identifier),
                       'asnIdToVendorCode',
                       (SELECT json_object_agg(vendor_id, json)
                        FROM asn_id_to_vendor_code),
                       'vendorCodeToAsnId',
                       (SELECT json_object_agg(vendor_id, json)
                        FROM vendor_code_to_asn_id),
                       'nameToId',
                       (SELECT json_object_agg(name, id)
                        FROM vendors),
                       'idToName',
                       (SELECT json_object_agg(id, name)
                        FROM vendors)
                   ) AS json;
        `);

        populateYields.push(shared.vendor);

        for (var entity in shared) {
            if (!(shared[entity] instanceof LookupTable) && shared[entity].entity) {
                shared[entity] = new LookupTable(
                    Object.assign({ pgp: sharedPgp, natsClient: nc }, shared[entity])
                );

                if (cachingEnabled &&
                    entity !== 'sparkpoint' &&
                    entity !== 'standard' &&
                    lookupCache.shared[entity] &&
                    typeof lookupCache.shared[entity].cache === 'object' &&
                    Object.keys(lookupCache.shared[entity].cache).length > 0) {
                    console.log(`Shared ${entity} cache hit`);
                    shared[entity].cache = lookupCache.shared[entity].cache;
                } else {
                    console.log(`Shared ${entity} cache miss`);
                    populateYields.push(shared[entity].populate(ctx.pgp));
                }
            }
        }
    }

    if (!ctx.healthcheck &&
        ctx.request.path.indexOf('/develop') === -1 &&
        ctx.schema !== undefined &&
        schema[ctx.schema] === undefined
    ) {
        schema[ctx.schema] || (schema[ctx.schema] = {});

        for (let entity in perSchool) {
            schema[ctx.schema][entity] = new LookupTable(
                Object.assign(
                    { pgp: ctx.app.context.pgp[ctx.schema], natsClient: nc },
                    perSchool[entity],
                    { schema: ctx.schema }
                )
            );

            if (cachingEnabled &&
                entity !== 'sparkpoint' &&
                lookupCache.schema &&
                lookupCache.schema[ctx.schema] &&
                lookupCache.schema[ctx.schema][entity] &&
                typeof lookupCache.schema[ctx.schema][entity].cache === 'object') {
                schema[ctx.schema][entity].cache = lookupCache.schema[ctx.schema][entity].cache;
                console.log(`${ctx.schema} ${entity} cache hit`);
            } else {
                console.log(`${ctx.schema} ${entity} cache miss`);
                populateYields.push(schema[ctx.schema][entity].populate(ctx.app.context.pgp[ctx.schema]));
            }
        }
    }

    if (populateYields.length > 0) {
        console.log(`Populating ${populateYields.length} lookup tables in parallel`);

        yield populateYields;

        if (shared.vendor && typeof shared.vendor.json !== 'object') {
            shared.vendor = shared.vendor.json;
        }

        if (cachingEnabled) {
            require('fs').writeFile(cachePath, JSON.stringify({ shared: shared, schema: schema }, null, '\t'), (err) => {
                if (err) {
                    console.warn(`${ctx.schema} lookup cache could not be written to disk: ${err}`);
                } else {
                    console.log(`${ctx.schema} lookup cache written to disk`);
                }
            });
        }
    }

    if (ctx.healthcheck) {
        ctx.lookup = shared;
    } else {
        // TODO: This seems like it could cause excessive memory usage or GC churn
        ctx.lookup = Object.assign(shared, schema[ctx.schema]);
    }

    ctx.app.context.lookup || (ctx.app.context.lookup = {
        shared: shared,
        schema: schema
    });

    yield next;
}

nc.on('error', function(error) {
    // TODO: evaluate how we want to handle NATS connection errors in the production API
   if (process.env.NODE_ENV !== 'production')  {
       throw error;
   } else {
       console.error('NATS: Error ', error);
   }
});

nc.on('reconnecting', function() {
   console.log('NATS: reconnecting...');
});

nc.on('disconnect', function() {
   console.log('NATS: disconnected');
});

nc.on('connect', function() {
   console.log('NATS: connected');
});

nc.on('reconnect', function() {
   console.log('NATS: Reconnected');
});

module.exports = lookup;