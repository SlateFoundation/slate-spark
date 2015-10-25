/*global module:true, require:true, console:true, process:true */

'use strict';

var path = require('path'),
    restify = require('restify'),
    cluster = require('cluster'),
    pg = require('pg'),
    routes = require('../routes'),
    openEdClientId,
    openEdClientSecret,
    conString;

try {
    configFile = fs.readFileSync(path.resolve(__dirname, 'config.json'), 'utf8');
    try {
        configFile = JSON.parse(configFile);

        openEdClientId = configFile.opened_client_id;
        openEdClientSecret = configFile.opened_client_secret;
        conString = configFile.pg_conn_string;
    } catch (err) {
        console.error('Error parsing /opt/spark/config.json.');
        process.exit(1);
    }
} catch (err) {
    if (openEdClientSecret === '' || openEdClientId === '' || conString == '') {
        console.error('Please provide a valid config.json in /opt/spark or edit the content-proxy file directly.');
        process.exit(1);
    }
}

exports.createServer = createServer;

function createServer(logger) {
    var server, config;

    config = {
        name: require(path.join(__dirname, '../package.json')).name,
        mapParams: true,
        overrideParams: true
    };

    if (logger) {
        config.log = logger;
    }

    server = restify.createServer(config);

    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.queryParser());
    server.use(restify.bodyParser());

    server.on('NotFound', function (req, res, next) {
        if (logger) {
            logger.debug('404', 'Request for ' + req.url + ' not found. No route.');
        }

        res.send(404, req.url + ' was not found');
    });

    server.get('/standards/:id', routes.standards);
    server.get('/standards', routes.standards);

    server.get('/work/learns', routes.work.learns.get);
    server.get('/work/learns/launch/:resource-id', routes.work.learns.launch);
    server.patch('/work/learns/:resource-id', routes.work.learns.patch);
    server.patch('/work/learns', routes.work.learns.patch);
    server.get('/work/conferences', routes.work.conferences);
    server.get('/work/applies', routes.work.applies);
    server.get('/work/assessments', routes.work.assessments);

    server.get('/work/activity', routes.work.activity.get);
    server.get('/work/activity/:section-id', routes.work.activity.get);
    server.put('/work/activity', routes.work.activity.post);
    server.post('/work/activity', routes.work.activity.post);

    server.on('uncaughtException', function (req, res, route, err) {
        res.statusCode = 500;
        res.json(err);
        console.error(err);
        process.send({type: error, error: err});
    });

    return server;
}