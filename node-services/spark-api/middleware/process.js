module.exports = function *(next) {
    this.set('X-Process-PID', process.pid);
    yield next;
};
