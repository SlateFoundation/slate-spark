'use strict';

var promise = require('bluebird'),
    monitor = require('pg-monitor'),
    Knex = require('knex'),
    options = { promiseLib: promise},
    Pgp = require('pg-promise')(options);

monitor.attach(options);
monitor.setTheme('matrix');

function objToConnectionString(obj) {
    return `postgres://${obj.username}:${obj.password}@${obj.host}:5432/${obj.database}?application_name=spark-api`;
}

function initializePgp(config, slateConfig) {
    var pgpConnections = {};

    if (config.postgresql && config.postgresql.sharedConnection) {
        pgpConnections.shared = Pgp(objToConnectionString(config.postgresql.sharedConnection));
    }

    (slateConfig.instances || [])
        .filter(instance => instance.postgresql)
        .forEach(instance => pgpConnections[instance.key] = Pgp(objToConnectionString(instance.postgresql)));

    return pgpConnections;
}

function initializeKnex(config, slateConfig) {
    var knexConnections = {};

    if (config.postgresql && config.postgresql.sharedConnection) {
        knexConnections.shared = Knex({
            client: 'pg',
            connection: objToConnectionString(config.postgresql.sharedConnection)
        });
    }

    (slateConfig.instances || [])
        .filter(instance => instance.postgresql)
        .forEach(function(instance) {
            let connection = Knex({
                client: 'pg',
                connection: objToConnectionString(instance.postgresql)
            });

            knexConnections[instance.key] = connection;

            connection.on('query', function(query) {
                console.log(query.sql);
            });
        });

    return knexConnections;
}

function pgp(options) {
    return function *pgp(next) {
        var schema = this.header['x-nginx-mysql-schema'];

        global.pgpConnections || (global.pgpConnections = initializePgp(options.config, options.slateConfig));

        if (schema) {
            this.pgp = global.pgpConnections[schema];
        } else {
            throw new Error('If you are not behind a load balancer; you must pretend to be. See README.md.');
        }

        this.sharedPgp = global.pgpConnections.shared;

        yield next;
    };
}

function knex(options) {
    return function *knex(next) {
        var schema = this.header['x-nginx-mysql-schema'];

        global.knexConnections || (global.knexConnections = initializeKnex(options.config, options.slateConfig));

        if (schema) {
            this.knex = global.knexConnections[schema];
        } else {
            throw new Error('If you are not behind a load balancer; you must pretend to be. See README.md.');
        }

        this.sharedknex = global.knexConnections.shared;

        yield next;
    };
}

module.exports = {
    knex: knex,
    pgp: pgp
};

