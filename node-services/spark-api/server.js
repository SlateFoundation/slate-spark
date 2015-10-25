/*global module:true, require:true, console:true, process:true */

'use strict';

var path = require('path'),
    cluster = require('cluster'),
    config = require('yaml-config'),
    settings = config.readConfig(path.join(__dirname, 'config.yaml')),
    worker = require('./lib/worker'),
    logging = require('./lib/logging'),

    NODE_ENV = process.env.NODE_ENV || 'development',
    calledDirectly = require.main === module;

exports.run = run;

// Complain if the script is run without using npm (unless it was loaded as a module)
if (calledDirectly && !process.argv.some(arg => arg.indexOf('forever') !== -1 || arg.indexOf('force') !== -1)) {
    console.log('To start the server please use: npm run-script development or npm run-script production');
    process.exit(1);
}

function spawnWorker(logger) {
    var server = worker.createServer(logger),
        port = settings.server.port || 8080;

    server.listen(port, function () {
        console.info('%s listening at %s', server.name, server.url);
    });
}

function createCluster(logger) {
    if (cluster.isMaster) {
        var numCpus = settings.workers || require('os').cpus().length;

        console.info('Starting master, pid ' + process.pid + ', spawning ' + numCpus + ' workers');

        Object.keys(cluster.workers).forEach(function(id) {
            cluster.workers[id].on('message', messageHandler);
        });

        for (var i = 0; i < numCpus; i++) {
            cluster.fork();
        }

        Object.keys(cluster.workers).forEach(function(id) {
            cluster.workers[id].on('message', function(message) {
                if (message.type === 'error') {
                    console.error(message.error);
                    logger.error(message.error);
                }
            });
        });
    } else {
        spawnWorker(logger);
    }
}

function run(cluster) {
    var logger = logging.createLogger(settings.logs);

    if (NODE_ENV === 'production' || Boolean(settings.server.cluster) || cluster) {
        createCluster();
    }
    else {
        spawnWorker();
    }
}

run();