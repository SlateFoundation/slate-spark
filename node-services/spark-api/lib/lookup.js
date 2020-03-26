'use strict';

var nats = require('nats'),
    // TODO: These should fail gracefully if the configuration file(s) do not exist
    natsCfg = require('../config/nats.json'),
    cachingEnabled = require('../config/caching.json').lookup,
    nc = nats.connect(natsCfg),
    cachePath = require('path').join(__dirname, '..', '/cache/lookup.json'),
    LookupTable = require('./LookupTable'),
    fs = require('fs').promises,
    shared = {
        standard: {
            entity: 'standard',
            idColumn: 'asn_id',
            customFunction: async function () {
                // This unrolls non-leaf standards providing a way to get all of the ASN Ids for a standard and its
                // children. This is primarily used for vendor cross walking.
                var idToAsnIds = await this.pgp.one(/*language=SQL*/ `
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
            onCacheBust: require('../routes/sparkpoints/autocomplete').bustCache
        },

        sparkpoint: {
            entity: 'sparkpoint',
            additionColumns: ['abbreviation'],
            customFunction: async function () {
                // TODO: This doesn't use sparkpoint alignments, it uses metadata
                var results = await this.pgp.any(`SELECT id, code, metadata->>'asn_id' AS asn_id FROM sparkpoints`),
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
            onCacheBust: require('../routes/sparkpoints/autocomplete').bustCache
        },
    },
    perSchool = {
        section: {
            entity: 'course_section',
            idColumn: 'ID',
            codeColumn: 'Code',
            onCacheBust: async function() {
                await this.pgp.none(`REFRESH MATERIALIZED VIEW CONCURRENTLY "${this.schema}".course_sections`);
            }
        },

        term: {
            entity: 'term',
            idColumn: 'ID',
            codeColumn: 'Handle',
            additionalColumns: ['Title', 'Status', 'StartDate', 'EndDate'],
            customFunction: function (records) {
                var self = this;

                self.idToRecord || (self.idToRecord = {});
                self.codeToRecord || (self.codeToRecord = {});

                records.forEach(function(record) {
                    record.StartDate = new Date(record.StartDate);
                    record.EndDate = new Date(record.EndDate);

                    self.idToRecord[record.ID] = record;
                    self.codeToRecord[record.Handle] = record;
                });
            },
            onCacheBust: async function() {
                await this.pgp.none(`REFRESH MATERIALIZED VIEW CONCURRENTLY "${this.schema}".terms`);
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
            onCacheBust: async function () {
                await this.pgp.none(`REFRESH MATERIALIZED VIEW CONCURRENTLY "${this.schema}".people`);
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

module.exports = async function lookup(ctx, next) {
    // Initialize global/shared lookup tables
    if (!initialized) {
        initialized = true;

        // TODO: figure out which of these to use
        // TODO: figure out what this meant ^^ :)
        shared.vendor = (await ctx.pgp.one(/*language=SQL*/ `
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
        `)).json;


        for (var entity in shared) {
            if (!(shared[entity] instanceof LookupTable) && shared[entity].entity) {
                shared[entity] = new LookupTable(
                    Object.assign({ pgp: ctx.app.context.pgp.shared, natsClient: nc }, shared[entity])
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
                    await shared[entity].populate(ctx.app.context.pgp.shared);
                }
            }
        }

        // TODO: HACK: Populating the vendor lookup table here doesn't make sense from a structural standpoint
        if (!cachingEnabled || typeof lookupCache.shared.vendor !== 'object') {
            let result = await ctx.app.context.pgp.shared.one(/*language=SQL*/ `
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

            if (cachingEnabled) {
                (cachePath, JSON.stringify({ shared: shared }, null, '\t'), (err) => {
                    if (err) {
                        console.warn('Shared lookup cache could not be written to disk: ' + err);
                    } else {
                        console.log('Shared lookup cache written to disk');
                    }
                });
            }
        }
    }

    if (!ctx.healthcheck &&
        ctx.request.path.indexOf('/develop') === -1 &&
        ctx.schema !== undefined &&
        schema[ctx.schema] === undefined
    ) {
        let bustJsonCache = false;

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
                bustJsonCache = true;
                await schema[ctx.schema][entity].populate(ctx.pgp);
            }
        }

        if (cachingEnabled && bustJsonCache) {
            await fs.writeFile(cachePath, JSON.stringify({ shared: shared, schema: schema }, null, '\t'), (err) => {
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
        ctx.lookup = Object.assign(shared, schema[ctx.schema]);
    }

    ctx.app.context.lookup || (ctx.app.context.lookup = {
        shared: shared,
        schema: schema
    });

    await next();
};

nc.on('error', function(error) {
    // TODO: evaluate how we want to handle NATS connection errors in the production API
   if (process.env.NODE_ENV !== 'production')  {
       // throw error;
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

