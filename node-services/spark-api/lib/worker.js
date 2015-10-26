/*global module:true, require:true, console:true, process:true */

'use strict';

var path = require('path'),
    restify = require('restify'),
    cluster = require('cluster'),
    routes = require('../routes'),
    sparkHeaderParser = require('./spark-headers');

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
    server.use(sparkHeaderParser());
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
    server.patch('/work/activity', routes.work.activity.patch);

    server.on('uncaughtException', function (req, res, route, err) {
        res.statusCode = 500;
        res.json(err);
        process.send({ type: 'error', route: route, req: req, error: err });
    });

    return server;
}

exports.createServer = createServer;