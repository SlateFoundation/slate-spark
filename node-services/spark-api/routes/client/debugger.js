var js = require('fs').readFileSync('/Users/jmealo/Repos/spark-api/routes/client/debugger.txt');

module.exports = {
    get: function*() {
        "use strict";
        var ctx = this;
        ctx.type = 'application/javascript';
        ctx.body = js;
    }
};
