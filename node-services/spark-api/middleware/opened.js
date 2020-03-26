'use strict';

const OpenEd = require('../lib/opened');
const async = require('async');

function initializeOpenEd(config) {
    var slateCfg = config.slate,
        openedCfg = config.opened;

    if (!slateCfg || !openedCfg) {
        console.error('[OPENED] Slate and OpenED configuration files are required');
        process.exit(1);
    }

    /*
    // SYNC: Initialize connection pool and get jeff@slate.is connection, renew access token
    if (config.postgresql && config.postgresql.sharedConnection) {
        pgpConnections.shared = Pgp(objToConnectionString(config.postgresql.sharedConnection));
    }

    // SYNC: Initialize service accounts, lazily create, for each nces_id
    (slateConfig.instances || [])
        .filter(instance => instance.postgresql)
        .forEach(instance => pgpConnections[instance.key] = Pgp(objToConnectionString(instance.postgresql)));
    
    // NOT REQUIRED: SYNC: check TTLs for last updated entities, output ones that need to be fixed, run them async
    
    
    // Queue up optional needed work here
    return requestAgentPool;*/

    return config.opened;
}

module.exports = function OpenEd(config) {

    var options = initializeOpenEd(config);

    return async function openedMiddleware(ctx, next) {
        ctx.set('opened-ran', true);
        ctx.set('opened-options', JSON.stringify(options));
        await next();
    };
};
