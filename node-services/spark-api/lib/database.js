'use strict';

const conString = 'postgres://spark:SparkPoint2015@10.240.103.217/spark';

var promise = require('bluebird'),
    monitor = require('pg-monitor'),
    options = {
        promiseLib: promise
    },
    pgp = require('pg-promise')(options),
    db = pgp(conString);

module.exports = db;

monitor.attach(options);

monitor.setTheme('matrix');
