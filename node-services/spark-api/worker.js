/*global module:true, require:true, console:true, process:true */

'use strict';

const PRODUCTION = process.env.NODE_ENV === 'production';

if (PRODUCTION) {
    var newrelic = require('newrelic'),
        slack = require('./lib/slack');
}

var koa = require('koa'),
    app = global.app = module.exports = koa(),

    requireDirectory = require('require-directory'),

    config = requireDirectory(module, './config'),
    middleware = requireDirectory(module, './middleware'),
    routes = requireDirectory(module, './routes'),

    jsonBody = require('koa-json-body'),
    _ = require('koa-route'),
    error = require('koa-error'),
    json = require('koa-json'),
    cluster = require('cluster'),
    lookup = require('./lib/lookup'),
    methods = require('methods'),
    iterator = require('object-recursive-iterator'),
    requestToCurl = require('koa-request-to-curl');

if (PRODUCTION) {
    app.use(middleware.newrelic(newrelic));
}

app.context.config = config;

if (Object.keys(config.logging || {}).some(key => key.substr(0,4) === 'git_')) {
    let co = require('co');
    let git = require('git-promise');

    app.context.git = {};

    co(function*() {
        if (config.logging.git_branch) {
            app.context.git.branch = (yield git('rev-parse --abbrev-ref HEAD', {cwd: __dirname})).trim();
        }

        if (config.logging.git_commit) {
            app.context.git.commit = (yield git('rev-parse --short HEAD', {cwd: __dirname})).trim();
        }
    }).catch(function(e) { throw e; });
}

app.context.config = config;
app.use(requestToCurl());
app.use(middleware.logging);
app.use(middleware.response_time);
app.use(error({ template: __dirname + '/config/error.html' }));
app.use(middleware.process);
app.use(middleware.session);
app.use(jsonBody({}));
app.use(middleware.database.pgp({
    config: config.database,
    slateConfig: config.slate
}));
app.use(lookup);
app.use(middleware.request);
app.use(json());

iterator.forAll(Object.assign({}, routes), function (path, key, obj) {
    var urlPath;

    // If the route module exports autoRoute: false, we won't setup auto routes to it
    if (typeof obj === 'object' && obj.autoRoute !== false) {
        urlPath = '/' + path.filter(key => key !== 'index').join('/');
    }

    // If the route module an HTTP method, we'll route to it
    if (urlPath && methods.indexOf(key) !== -1) {
        app.use(_[key](urlPath, obj[key]));
    }
});

// Custom routes
app.use(_.get('/standards/:id', routes.standards.get));
app.use(_.get('/work/learns/launch/:resourceId', routes.work.learns.launch));
app.use(_.get('/sparkpoints/autocomplete/:input', routes.sparkpoints.autocomplete.get));
app.use(_.get('/sparkpoints/autocomplete', routes.sparkpoints.autocomplete.get));
app.use(_.get('/sparkpoints/suggested', routes.sparkpoints.suggested.get));
app.use(_.get('/test/error/:code', require(__dirname + '/routes/test/error').get));
app.use(_.get('/assignments/:entity', routes.assignments.entity.get));
app.use(_.patch('/assignments/:entity', routes.assignments.entity.patch));
app.use(_.post('/assignments/:entity', routes.assignments.entity.post));

if (PRODUCTION) {
    app.on('error', function(error, ctx) {
        if (ctx.response.status != 400) {

            newrelic.noticeError(error);

            slack.postErrorToSlack(error, ctx)(function(error, response) {
                if (error) {
                    console.error('Error posting error to Slack:\n', error, response);
                }
            });
        }
    });
}

app.port = 9090;

if (cluster.isMaster) {
    app.listen(app.port);
} else {
    app.use(function* () {
        if (this.req.checkContinue) {
            this.res.writeContinue();
        }

        yield;
    });
}