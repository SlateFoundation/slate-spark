/*global module:true, require:true, console:true, process:true */

'use strict';

const PRODUCTION = process.env.NODE_ENV === 'production';

if (PRODUCTION) {
    var newrelic = require('newrelic'),
        slack = require('./lib/slack');
}

var koa = require('koa'),
    app = module.exports = koa(),
    config = require('./config/index'),
    middleware = require('./middleware/index'),
    jsonBody = require('koa-json-body'),
    _ = require('koa-route'),
    routes = require('./routes/index'),
    error = require('koa-error'),
    json = require('koa-json'),
    cluster = require('cluster'),
    lookup = require('./lib/lookup');

if (PRODUCTION) {
    app.use(middleware.newrelic(newrelic));
}

app.use(middleware.response_time);
app.use(error({ template: './config/error.html' }));
app.use(middleware.process);
app.use(middleware.logger);
app.use(middleware.session);
app.use(jsonBody({}));
app.use(middleware.database.knex({
    config: config.database,
    slateConfig: config.slate
}));
app.use(middleware.database.pgp({
    config: config.database,
    slateConfig: config.slate
}));
app.use(lookup.initialize);
app.use(middleware.request);
app.use(json());

// Standards
app.use(_.get('/standards/:id', routes.standards.get));
app.use(_.get('/standards', routes.standards.list));

// Activity
app.use(_.get('/work/activity', routes.work.activity.get));
app.use(_.patch('/work/activity', routes.work.activity.patch));

// Assessments
app.use(_.get('/work/assessments', routes.work.assessments));

// Assess
app.use(_.get('/work/assess', routes.work.assess.get))
app.use(_.patch('/work/assess', routes.work.assess.patch));

// Learns
app.use(_.get('/work/learns', routes.work.learns.get));
app.use(_.get('/work/learns/launch/:resourceId', routes.work.learns.launch));
app.use(_.patch('/work/learns', routes.work.learns.patch));

// Applies
app.use(_.get('/work/applies', routes.work.applies.get))
app.use(_.patch('/work/applies', routes.work.applies.patch))
app.use(_.post('/work/applies/submissions', routes.work.applies.submissions.post));
app.use(_.delete('/work/applies/submissions', routes.work.applies.submissions.delete));

// Conferences
app.use(_.get('/work/conferences', routes.work.conferences.get));
app.use(_.post('/work/conferences/questions', routes.work.conferences.questions.post));
app.use(_.patch('/work/conferences/worksheet', routes.work.conferences.worksheet.patch));

// Conference groups
app.use(_.patch('/work/conference-groups', routes.work['conference-groups'].patch));
app.use(_.post('/work/conference-groups', routes.work['conference-groups'].patch));
app.use(_.get('/work/conference-groups', routes.work['conference-groups'].get));

// Todos
app.use(_.get('/todos', routes.todos.get));
app.use(_.patch('/todos', routes.todos.patch));
app.use(_.post('/todos', routes.todos.patch));

// Feedback
app.use(_.get('/work/feedback', routes.work.feedback.get));
app.use(_.patch('/work/feedback', routes.work.feedback.patch));
app.use(_.post('/work/feedback', routes.work.feedback.post));

// Sparkpoints
app.use(_.get('/sparkpoints/autocomplete/:input', routes.sparkpoints.autocomplete.get));
app.use(_.get('/sparkpoints/autocomplete', routes.sparkpoints.autocomplete.get));
app.use(_.get('/sparkpoints/suggested', routes.sparkpoints.suggested.get));

// OpenEd
// app.use(_.get('/opened/csv', routes.opened.index.csv.get));

// Test
app.use(_.get('/test', routes.test.get));

// Healthcheck
app.use(_.get('/healthcheck', routes.healthcheck.get));

// Assignments
app.use(_.get('/assign/learns', routes.assign.learns.get));
app.use(_.patch('/assign/learns', routes.assign.learns.patch));
app.use(_.get('/assign/applies', routes.assign.applies.get));
app.use(_.patch('/assign/applies', routes.assign.applies.patch));

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

/*
nc.subscribe('cache.*.public.*.*', function(msg, reply, subject) {
    var tokens = subject.split('.'),
        action = tokens[1],
        pk = tokens.pop(),
        table = tokens.pop();

    Object.keys(cluster.workers).forEach(function(id) {
        cluster.workers[id].send({
            type: 'cache',
            action: action,
            entity: table,
            pk: pk
        });
    });
});
*/

if (cluster.isMaster) {
    module.exports.onCacheEvent = cacheBuster;
    app.listen(app.port);
} else {
    process.on('message', cacheBuster);
    
    app.use(function* () {
        if (this.req.checkContinue) {
            this.res.writeContinue();
        }

        yield;
    });
}

function cacheBuster(msg) {
    if (msg.entity === 'standards') {
        if (lookup.entities.standard.timeout) {
            console.log('Waiting until changes stop coming in for 1s to bust standard lookup table...');
            clearTimeout(lookup.entities.standard.timeout);
        }

        lookup.entities.standard.timeout = setTimeout(function() {
            console.log('Busting standard lookup table...');
            lookup.populateLookupTable.call(null, lookup.entities.standard.arguments);
            lookup.entities.standard.timeout = null;
        }, 1000);
    } else if (msg.entity === 'sparkpoints') {
        if (lookup.entities.sparkpoint.timeout) {
            console.log('Waiting until changes stop coming in for 1s to bust sparkpoint lookup table...');
            clearTimeout(lookup.entities.sparkpoint.timeout);
        }

        lookup.entities.sparkpoint.timeout = setTimeout(function() {
            console.log('Busting sparkpoint lookup table...');
            lookup.populateLookupTable.call(null, lookup.entities.sparkpoint.arguments);
            lookup.entities.sparkpoint.timeout = null;
        }, 1000);
    }
}