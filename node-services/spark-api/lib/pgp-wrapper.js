'use strict';

require('generator-bind').polyfill();

function PgpWrapper(pgp, ctx) {
    this.pgp = pgp;
    this.ctx = ctx;
}

/* This wrapper is verbose and minimalistic in order to optimise for:
    1. Garbage collection [each instance is just two references with methods on prototype, not each instance]
    2. Execution speed / V8 Optimization [ES6/ES5 meta-programming features are slow. V8 can optimise simple objects.
    3. Code auto-completion [explicitly defining the methods should work with most IDEs, looping over an array may not]
*/

PgpWrapper.prototype.none = function(query, values) {
    return this.pgp.none(this.ctx.guc() + query, values);
};

PgpWrapper.prototype.one = function(query, values) {
    return this.pgp.one(this.ctx.guc() + query, values);
};

PgpWrapper.prototype.many = function(query, values) {
    return this.pgp.many(this.ctx.guc() + query, values);
};

PgpWrapper.prototype.oneOrNone = function(query, values) {
    return this.pgp.oneOrNone(this.ctx.guc() + query, values);
};

PgpWrapper.prototype.manyOrNone = function(query, values) {
    return this.pgp.manyOrNone(this.ctx.guc() + query, values);
};

PgpWrapper.prototype.any = function(query, values) {
    return this.pgp.any(this.ctx.guc() + query, values);
};

PgpWrapper.prototype.result = function(query, values) {
    return this.pgp.result(this.ctx.guc() + query, values);
};

PgpWrapper.prototype.task = function (p1, p2) {
    p1 = p1.bind({}, this);

    if (p2) {
        p2 = p2.bind({}, this);
    }

    return this.pgp.task(p1, p2);
};

module.exports = PgpWrapper;