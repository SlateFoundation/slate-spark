var request = require('koa-request');

function postErrorToSlack(error, ctx, details, broadcast) {
    delete ctx.request.headers['x-nginx-session'];

    broadcast = typeof broadcast === 'boolean' ? broadcast : true;

    var text = [];

    if (broadcast) {
        text.push('<!channel>');
    }

    text.push(`*HTTP ${ctx.response.status} ${ctx.request.method} ${ctx.request.url}* (${new Date()})`);

    if (error.message) {
        text.push('*Message:*\n```' + error.message + '```');
    }

    if (error.stack) {
        text.push('*Stack:*\n```' + error.stack + '```');
    }

    text.push('*Request:*\n```' + JSON.stringify(ctx.request, null, '   ') + '```');

    if (Object.keys(ctx.query).length > 0) {
        text.push('*Query:*\n```' + JSON.stringify(ctx.query, null, '   ') + '```');
    }

    if (ctx.body) {
        text.push('*Request Body:*\n```' + JSON.stringify(ctx.body, null, '   ') + '```');
    }

    if (Object.keys(ctx.session).length > 0) {
        text.push('*Session:*\n```' + JSON.stringify(ctx.session, null, '   ') + '```');
    }

    if (details) {
        text.push('*Details:*\n```' + JSON.stringify(details, null, '    ') + '```');
    }

    return request({
        method: 'POST',
        url: 'https://hooks.slack.com/services/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',
        json: true,
        body: {
            text: text.join('\n')
        }
    });
}

module.exports = {
    postErrorToSlack: postErrorToSlack
};
