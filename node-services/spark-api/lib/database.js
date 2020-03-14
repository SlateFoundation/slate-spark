'use strict';

var promise = require('bluebird'),
    monitor = require('pg-monitor'),
    options = {
        promiseLib: promise
    },
    pgp = require('pg-promise')(options),
    connections = {},
    config = require('../config/database.json').postgresql.sharedConnection,
    sharedConnection = pgp(`postgres://${config.username}:${config.password}@${config.host}/${config.database}?application_name=spark-api`);

monitor.attach(options);

monitor.setTheme('matrix');

module.exports = sharedConnection;
