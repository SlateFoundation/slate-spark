/*global module:true, require:true, console:true, process:true */

'use strict';

const PRODUCTION = process.env.NODE_ENV === 'production';

if (PRODUCTION) {
    var newrelic = require('newrelic'),
        slack = require('./lib/slack');
}

var koa = require('koa'),
    app = new koa(),
    requireDirectory = require('require-directory'),

    config = requireDirectory(module, './config'),
    middleware = requireDirectory(module, './middleware'),
    routes = requireDirectory(module, './routes'),

    jsonBody = require('koa-json-body'),
    Router = require('koa-router'),
    router = new Router(),
    error = require('koa-error'),
    json = require('koa-json'),
    cluster = require('cluster'),
    lookup = require('./lib/lookup'),
    methods = require('methods'),
    iterator = require('object-recursive-iterator'),
    requestToCurl = require('koa-request-to-curl'),
    conditional = require('koa-conditional-get'),
    etag = require('koa-etag');

if (PRODUCTION) {
    app.use(middleware.newrelic(newrelic));
} else {
    // Strip /spark/api from paths while in development mode
    app.use(async function(ctx, next) {
        if (ctx.path.startsWith('/spark/api')) {
            ctx.path = ctx.path.substr(10);
        }

        await next();
    });
}

global.appRoot = require('path').resolve(__dirname);

// TODO: global.app is used by asn-standard, let's remove it (module.exports is required by koa-cluster!)
module.exports = global.app = app;

app.context.config = config;

app
    .use(requestToCurl())
    .use(middleware.logging)
    .use(conditional())
    .use(middleware.response_time)
    .use(error({
        template: __dirname + '/config/error.html',
        engine: 'swig'
    }))
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
    .use(middleware.preferences());

if (PRODUCTION) {
    // In production calculate ETags
    app.use(etag());
} else {
    // In development pretty-print responses
    app.use(json());
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
        console.log(key.toUpperCase(), urlPath);
        router[key](urlPath, obj[key]);
    }
});

// Custom routes
router.get('/work/learns/launch/:resourceId', routes.work.learns.launch);
router.get('/work/learns/summary', routes.work.learns.summary);
router.get('/work/learns/section', routes.work.learns.section);

router.get('/test', routes.test.index.get);

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
    .use(router.allowedMethods());


if (Object.keys(config.logging || {}).some(key => key.substr(0,4) === 'git_')) {
    (async function() {
        var git = require('git-promise');

        app.context.git = {
            branch: 'unknown',
            commit: 'unknown'
        };

        try {
            if (config.logging.git_branch) {
                let branch = (await git('rev-parse --abbrev-ref HEAD', {cwd: __dirname})).trim();
                if (branch) app.context.git.branch = branch;
            }
            if (config.logging.git_commit) {
                let commit =  (await git('rev-parse --short HEAD', {cwd: __dirname})).trim();
                if (commit) app.context.git.commit = commit;
            }
        } catch (e) {
            console.warn('Unable to determine git_branch/git_commit, using defaults...');
        }
    })();
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

app.port = 8090;

// Setup koa-cluster
if (cluster.isMaster) {
    app.listen(app.port);
} else {
    // TODO: koa-cluster doesn't seem to have been updated?
    app.use(async function(ctx, next) {
        if (ctx.req.checkContinue) {
            ctx.res.writeContinue();
        }

        await next();
    });
}
