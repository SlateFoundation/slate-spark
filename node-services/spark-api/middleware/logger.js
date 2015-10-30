module.exports = function *logger(next) {
    var start = new Date;

    yield next;

    var ms = new Date - start;
    console.log('%s %s - %s', this.method, this.url, ms, 'ms');
};