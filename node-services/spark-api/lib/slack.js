var request = require('koa-request');

function postErrorToSlack(error, ctx, details, broadcast) {
    delete ctx.request.headers['x-nginx-session'];

    broadcast = typeof broadcast === 'boolean' ? broadcast : true;

    return request({
        method: 'POST',
        url: 'https://hooks.slack.com/services/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',
        json: true,
        body: {
            text: [
                broadcast ? '<!channel>' : '',
                `*HTTP ${ctx.response.status} ${ctx.request.method} ${ctx.request.url}* (${new Date()})`,
                '*Stack:*',
                '```' + error.stack + '```',
                '*Request:*',
                '```' + JSON.stringify(ctx.request, null, '   ') + '```',
                '*Query:*',
                '```' + JSON.stringify(ctx.request.query, null, '   ') + '```',
                '*Body:*',
                '```' + JSON.stringify(ctx.request.body, null, '   ') + '```',
                '*Session:*',
                '```' + JSON.stringify(ctx.session, null, '   ') + '```',
                details ? ('*Details:*\n```' + JSON.stringify(details, null, '   ') + '```') : ''
            ].join('\n')
        }
    });
}

module.exports = {
    postErrorToSlack: postErrorToSlack
};
