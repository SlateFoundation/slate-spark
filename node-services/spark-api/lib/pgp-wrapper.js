'use strict';

function PgpWrapper(pgp, ctx) {
    this.pgp = pgp;
    this.ctx = ctx;
}

PgpWrapper.prototype.none = function(query, values) {
    return this.pgp.none.call(this.pgp, this.ctx.guc() + query, values);
};

PgpWrapper.prototype.one = function(query, values) {
    return this.pgp.one.call(this.pgp, this.ctx.guc() + query, values);
};

PgpWrapper.prototype.many = function(query, values) {
    return this.pgp.many.call(this.pgp, this.ctx.guc() + query, values);
};

PgpWrapper.prototype.oneOrNone = function(query, values) {
    return this.pgp.oneOrNone.call(this.pgp, this.ctx.guc() + query, values);
};

PgpWrapper.prototype.manyOrNone = function(query, values) {
    return this.pgp.manyOrNone.call(this.pgp, this.ctx.guc() + query, values);
};

PgpWrapper.prototype.any = function(query, values) {
    return this.pgp.any.call(this.pgp, this.ctx.guc() + query, values);
};

PgpWrapper.prototype.result = function(query, values) {
    return this.pgp.result.call(this.pgp, this.ctx.guc() + query, values);
};

module.exports = PgpWrapper;
