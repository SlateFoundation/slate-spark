'use strict';

var promise = require('bluebird'),
    monitor = require('pg-monitor'),
    Knex = require('knex'),
    options = { promiseLib: promise},
    Pgp = require('pg-promise')(options),
    knexConnections = {},
    pgpConnections = {};

monitor.attach(options);
monitor.setTheme('matrix');

function objToConnectionString(obj) {
    return `postgres://${obj.username}:${obj.password}@${obj.host}:5432/${obj.database}?application_name=spark-api`;
}

function initializePgp(config, slateConfig) {
    if (config.postgresql && config.postgresql.sharedConnection) {
        pgpConnections.shared = Pgp(objToConnectionString(config.postgresql.sharedConnection));
    }

    (slateConfig.instances || [])
        .filter(instance => instance.postgresql)
        .forEach(instance => pgpConnections[instance.key] = Pgp(objToConnectionString(instance.postgresql)));

    return pgpConnections;
}

function initializeKnex(config, slateConfig) {
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

        this.app.context.pgp || (this.app.context.pgp = initializePgp(options.config, options.slateConfig));

        if (schema) {
            this.pgp = this.app.context.pgp[schema];
        } else if (this.request.path === '/healthcheck') {
            this.pgp = this.app.context.pgp.shared;
        } else {
            this.throw(new Error('If you are not behind a load balancer; you must pretend to be. See README.md.'), 400);
        }

        if (!this.pgp) {
            this.throw(new Error(`Unable to initialize pgp.. (Check if ${this.schema} is a valid Slate instance)`));
        }

        this.sharedPgp = this.app.context.pgp.shared;

        this.guc = function(query) {
            return `
                SET spark.user_id = '${this.userId}';
                SET spark.role = '${this.role}';
                SET spark.request_id = '${this.requestId}';
                SET application_name = 'spark-api_${this.username}_${this.requestId}';
                ${query}
            `;
        };

        yield next;
    };
}

function knex(options) {
    return function *knex(next) {
        var schema = this.header['x-nginx-mysql-schema'];

        this.app.context.knex || (this.app.context.knex = initializeKnex(options.config, options.slateConfig));

        if (schema) {
            this.knex = this.app.context.knex[schema];
        } else if (this.request.path === '/healthcheck') {
            this.knex = this.app.context.knex.shared;
        } else {
            this.throw(new Error('If you are not behind a load balancer; you must pretend to be. See README.md.'), 400);
        }

        if (!this.knex) {
            this.throw(new Error(`Unable to initialize knex... (Check if ${this.schema} is a valid Slate instance)`));
        }

        this.sharedKnex = this.app.context.knex.shared;

        yield next;
    };
}

module.exports = {
    knex: knex,
    pgp: pgp,
    knexConnections: knexConnections,
    pgpConnections: pgpConnections
};