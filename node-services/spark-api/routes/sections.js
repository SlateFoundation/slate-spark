'use strict';

var request = require('koa-request');

const PRODUCTION = process.env.NODE_ENV === 'production';

var subdomainBySchema = {
    'sandbox-school': 'sandbox-school',
    'mta-live' : 'spark.mta',
    'merit-live' : 'spark.merit',
    'mta-staging': 'staging.spark.mta',
    'merit-staging': 'staging.spark.merit'
};

async function getHandler(ctx, next) {
    var ctx = this;
    
    let sections = await request({
        url: `https://${subdomainBySchema[ctx.schema]}.matchbooklearning.com/${ctx.path}?format=json`,
        headers: {
            cookie: `${ctx.schema}-s=${ctx.cookies.get('session_id')};`
        }
    });

    ctx.type = 'json';
    ctx.body = sections.body;
}

module.exports = {
    get: getHandler
};
