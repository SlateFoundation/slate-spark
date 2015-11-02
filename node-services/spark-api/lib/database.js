'use strict';

const host = '10.240.103.217';
const db = 'spark';

var promise = require('bluebird'),
    monitor = require('pg-monitor'),
    options = {
        promiseLib: promise
    },
    pgp = require('pg-promise')(options),
    connections = {},
    sharedConnection = pgp(`postgres://spark:SparkPoint2015@${host}/${db}`);

// TODO: change passwords and move to a config file in a repo with git-crypt
const password = 'TpgeVl04Os9Ot7t2H7rySjREhxFiKZ';

['sandbox-school', 'mta-live', 'mta-staging', 'merit-live', 'merit-staging', 'fusebox-live'].forEach(function(schema) {
    var username = schema;
    connections[schema] = pgp(`postgres://${username}:${password}@${host}/${db}`);
});

monitor.attach(options);

monitor.setTheme('matrix');

module.exports = function db(req) {
    var connection;

    if (req) {
        if (req.schema) {
            connection = connections[req.schema];

            if (connection) {
                return connection;
            } else {
                throw new Error('Could not find a database connection for schema: ' + req.schema);
            }
        }

        throw new Error('Unable to determine database schema from session in request. This should NEVER happen!');
    } else {
        return sharedConnection;
    }
};
