/*global module:true, require:true, console:true, process:true */

'use strict';

const PRODUCTION = process.env.NODE_ENV === 'production';

if (PRODUCTION) {
    var newrelic = require('newrelic'),
        slack = require('./lib/slack');
}

var koa = require('koa'),
    app = global.app = module.exports = koa(),
    config = require('./config/index'),
    middleware = require('./middleware/index'),
    jsonBody = require('koa-json-body'),
    _ = require('koa-route'),
    routes = require('./routes/index'),
    error = require('koa-error'),
    json = require('koa-json'),
    cluster = require('cluster'),
    lookup = require('./lib/lookup'),
    requestToCurl = require('koa-request-to-curl');

if (PRODUCTION) {
    app.use(middleware.newrelic(newrelic));
}

app.context.config = config;
app.use(middleware.response_time);
app.use(requestToCurl());
app.use(error({ template: __dirname + '/config/error.html' }));
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
app.use(lookup);
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

// Help
app.use(_.get('/help', routes.help.get));
app.use(_.post('/help', routes.help.post));
app.use(_.patch('/help', routes.help.patch));

// Test
app.use(_.get('/test', routes.test.get));

// Healthcheck
app.use(_.get('/healthcheck', routes.healthcheck.get));

// Assignments
app.use(_.get('/assignments/learns', routes.assignments.learns.get));
app.use(_.patch('/assignments/learns', routes.assignments.learns.patch));
app.use(_.post('/assignments/learns', routes.assignments.learns.patch));

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