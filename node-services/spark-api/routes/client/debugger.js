var js = require('fs').readFileSync(require('path').resolve(__dirname, 'debugger.txt'));

module.exports = {
    get: function*() {
        "use strict";
        var ctx = this;
        ctx.type = 'application/javascript';
        ctx.body = js;
    }
};
