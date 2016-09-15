/*global module:true, require:true, console:true, process:true */

'use strict';

const PRODUCTION = process.env.NODE_ENV === 'production';

if (PRODUCTION) {
    var newrelic = require('newrelic'),
        slack = require('./lib/slack');
}

var koa = require('koa'),
    app = koa(),
    requireDirectory = require('require-directory'),

    config = requireDirectory(module, './config'),
    middleware = requireDirectory(module, './middleware'),
    routes = requireDirectory(module, './routes'),

    serve = require('koa-static-folder'),
    jsonBody = require('koa-json-body'),
    router = require('koa-router')(),
    error = require('koa-error'),
    json = require('koa-json'),
    cluster = require('cluster'),
    lookup = require('./lib/lookup'),
    methods = require('methods'),
    iterator = require('object-recursive-iterator'),
    requestToCurl = require('koa-request-to-curl');

if (PRODUCTION) {
    app.use(middleware.newrelic(newrelic));
} else {
    // Strip /spark/api from paths while in development mode
    app.use(function*(next) {
        var ctx = this;

        if (ctx.path.substr(0, 10) === '/spark/api') {
            ctx.path = ctx.path.substr(10);
        }

        yield next;
    });
}

global.appRoot = require('path').resolve(__dirname);

// TODO: global.app is used by asn-standard, let's remove it (module.exports is required by koa-cluster!)
module.exports = global.app = app;

app.context.config = config;

app
    .use(requestToCurl())
    .use(middleware.logging)
    .use(middleware.response_time)
    .use(error({ template: __dirname + '/config/error.html' }))
    .use(middleware.process)
    .use(middleware.session)
    .use(middleware.acl)
    .use(jsonBody({}))
    .use(middleware.database.pgp({
        config: config.database,
        slateConfig: config.slate
    }))
    .use(lookup)
    .use(middleware.request)
    .use(middleware.debugging)
    .use(json())
    .use(middleware.preferences())
    // .use(middleware.opened(config))
    .use(json());

function* notImplementedHandler() {
    ctx.throw(405, `${ctx.method} not implemented.`);
}

// TODO: I hate to have rolled my own auto-router...
iterator.forAll(Object.assign({}, routes), function (path, key, obj) {
    var urlPath;

    // If the route module exports autoRoute: false, we won't setup auto routes to it
    if (typeof obj === 'object' && obj.autoRoute !== false) {
        urlPath = '/' + path.filter(key => key !== 'index').join('/');
    }

    // If the route module exports an HTTP method, we'll route to it
    if (urlPath && methods.includes(key)) {
        router[key](urlPath, obj[key]);
    }
});

var methodsForPath = {};

// HACK: make sure 405s work
iterator.forAll(Object.assign({}, routes), function (path, key, obj) {
    var urlPath;

    // If the route module exports autoRoute: false, we won't setup auto routes to it
    if (typeof obj === 'object' && obj.autoRoute !== false) {
        urlPath = '/' + path.filter(key => key !== 'index').join('/');
    }

    // If the route module exports an HTTP method, we'll route to it
    if (urlPath && methods.includes(key)) {
        methodsForPath[urlPath] || (methodsForPath[urlPath] = {});
        methodsForPath[urlPath][key] = true;
    }
});

for (var path in methodsForPath) {
    var pathMethods = methodsForPath[path];
    methods
        .filter(method => pathMethods[method] === true)
        .forEach(method => router[method](path, notImplementedHandler));
}

console.log(methodsForPath);

// Custom routes
router.get('/work/learns/launch/:resourceId', routes.work.learns.launch);

router.get('/test', routes.test.index.get);

router.get('/sparkpoints/autocomplete/:input', routes.sparkpoints.autocomplete.get);
router.get('/sparkpoints/autocomplete', routes.sparkpoints.autocomplete.get);
router.get('/sparkpoints/suggested', routes.sparkpoints.suggested.get);

router.get('/test/error/:code', require(__dirname + '/routes/test/error').get);

router.get('/assignments/:entity', routes.assignments.entity.get);
router.patch('/assignments/:entity', routes.assignments.entity.patch);
router.post('/assignments/:entity', routes.assignments.entity.post);

router.get('/assign/learns/:resourceId/discussions', routes.assign.learn_discussions.get);
router.patch('/assign/learns/:resourceId/discussions', routes.assign.learn_discussions.patch);
router.post('/assign/learns/:resourceId/discussions', routes.assign.learn_discussions.post);
router.delete('/assign/learns/:resourceId/discussions', routes.assign.learn_discussions.delete);

router.get('/assignments/reports/usage', routes.assignments.index.report.get);

router.get('/preferences/learns', routes.preferences.stopgap.get);
router.patch('/preferences/learns', routes.preferences.stopgap.patch);
router.post('/preferences/learns', routes.preferences.stopgap.post);

app
    .use(router.routes())
    .use(router.allowedMethods())
    .use(serve('./static'));

if (Object.keys(config.logging || {}).some(key => key.substr(0,4) === 'git_')) {
    let co = require('co');
    let git = require('git-promise');

    app.context.git = {
        branch: 'unknown',
        commit: 'unknown'
    };

    co(function*() {
        if (config.logging.git_branch) {
            app.context.git.branch = (yield git('rev-parse --abbrev-ref HEAD', {cwd: __dirname})).trim();
        }

        if (config.logging.git_commit) {
            app.context.git.commit = (yield git('rev-parse --short HEAD', {cwd: __dirname})).trim();
        }
    }).catch(function(e) {
        console.warn('Unable to determine git_branch/git_commit, using defaults...');
    });
}

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

// Setup koa-cluster
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