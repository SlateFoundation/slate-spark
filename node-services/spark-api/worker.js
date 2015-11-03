/*global module:true, require:true, console:true, process:true */

'use strict';

var koa = require('koa'),
    app = module.exports = koa(),
    config = require('./config/index'),
    middleware = require('./middleware/index'),
    jsonBody = require('koa-json-body'),
    _ = require('koa-route'),
    routes = require('./routes/index'),
    error = require('koa-error'),
    request = require('koa-request');

app.use(middleware.response_time);
app.use(error());
app.use(middleware.logger);
app.use(middleware.session);
app.use(jsonBody({}));
app.use(middleware.request);
app.use(middleware.database.knex({
    config: config.database,
    slateConfig: config.slate
}));
app.use(middleware.database.pgp({
    config: config.database,
    slateConfig: config.slate
}));

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

// Conferences
app.use(_.get('/work/conferences', routes.work.conferences.get));
app.use(_.post('/work/conferences/questions', routes.work.conferences.questions.post));
app.use(_.patch('/work/conferences/worksheet', routes.work.conferences.worksheet.patch));

// Todos
app.use(_.get('/todos', routes.todos.get));
app.use(_.patch('/todos', routes.todos.patch));

// Feedback
app.use(_.get('/feedback', routes.feedback.get));
app.use(_.patch('/feedback', routes.feedback.patch));
app.use(_.delete('/feedback', routes.feedback.delete));

function postErrorToSlack(error, ctx) {

    delete ctx.request.headers['x-nginx-session'];

    return request({
        method: 'POST',
        url: 'https://hooks.slack.com/services/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',
        json: true,
        body: {
            text: [
                `<!channel> *HTTP ${ctx.response.status} ${ctx.request.method} ${ctx.request.url}* (${new Date()})`,
                '*Stack:*',
                '```' + error.stack + '```',
                '*Request:*',
                '```' + JSON.stringify(ctx.request, null, '   ') + '```',
                '*Session:*',
                '```' + JSON.stringify(ctx.session, null, '   ') + '```'
                ].join('\n')
        }
    });
}

// TODO: use node production/development variables in startup scripts and package.json scripts
if (require('os').hostname().indexOf('spark') !== -1) {
    app.on('error', function(error, ctx) {
        postErrorToSlack(error, ctx)(function(error, response) {
            if (error) {
                console.error('Error posting error to Slack:\n', error, response);
            }
        });
    });
}
