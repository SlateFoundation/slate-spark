var js = require('fs').readFileSync(require('path').resolve(__dirname, 'debugger.txt'));

module.exports = {
    get: async function(ctx, next) {
        ctx.type = 'application/javascript';
        ctx.body = js;
    }
};
