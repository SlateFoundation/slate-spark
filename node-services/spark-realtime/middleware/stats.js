'use strict';

function ioStats(options) {
    options = options || {};

    function SimpleMetric(name) {
        Object.defineProperty(this, 'name', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: name
        });

        this.current = 0;
        this.min = 0;
        this.max = 0;
        this.change_timestamp = null;
        this.since_timestamp = new Date();
        this.min_timestamp = null;
        this.max_timestamp = null;
    }

    SimpleMetric.prototype.increment = function increment() {
        this.set(++this.current);
    };

    SimpleMetric.prototype.decrement = function decrement() {
        this.set(--this.current);
    };

    SimpleMetric.prototype.set = function set(val) {
        var now = new Date();

        if (this.current !== val) {
            this.change_timestamp = now;
        }

        this.current = val;

        if (this.current > this.max) {
            this.max = this.current;
            this.max_timestamp = now;
        }

        if (this.current < this.min || !this.min_timestamp) {
            this.min = this.current;
            this.min_timestamp = now;
        }
    };

    function AdvancedMetric(name, subtypes, total) {
        var self = this;

        Object.defineProperty(this, 'name', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: name
        });

        if (total !== false) {
            this.total = new SimpleMetric('total');
        }

        this.metrics = subtypes.map(function(subtype) {
            var metric =  new SimpleMetric(subtype);
            self[subtype] = metric;

            if (total !== false) {
                metric.set = function set(val) {
                    self.total.set(subtypes.reduce(function(prev, current) {
                        return prev + self[current].current;
                    }, 0));

                    this.__proto__.set.call(this, val);
                };
            }

            return metric;
        });
    }

    AdvancedMetric.prototype.set = function set(values) {
        for (var metric in values) {
            this[metric].set(values[metric]);
        }
    };

    AdvancedMetric.prototype.toJSON = function() {
        var obj = {};

        this.metrics.forEach(metric => obj[metric.name] = metric);

        if (obj.total) {
            obj.total = this.total;
        }

        return obj;
    };

    var aggregates = {
        connections: new SimpleMetric('connections'),
        subscriptions: new SimpleMetric('subscriptions'),
        incoming: new SimpleMetric('incoming'),
        outgoing: new AdvancedMetric('outgoing', ['broadcast', 'identified', 'unidentified']),
        nats: new AdvancedMetric('nats', ['processed', 'dropped', 'ignored']),
        users: new AdvancedMetric('users', ['online', 'offline']),
        memory_usage: new AdvancedMetric('memory_usage', ['heapUsed', 'heapTotal', 'rss'], false)
    },
    users = {},
    sections = {};

    // HTTP request handler
    global.httpServer.on('request', function statsRequestHandler(req, res) {
        switch (req.url) {
            case '/stats':
            case '/healthcheck':
                aggregates.connections.set(io.sockets.sockets.length);
                aggregates.memory_usage.set(process.memoryUsage());
                res.end(JSON.stringify(aggregates, null, '\t'));
                break;
            default:
                res.httpStatus = 404;
                res.end('File not found');
        }
    });

    global.stats = {
        aggregates: aggregates,
        users: users,
        sections: sections
    };

    return function statsCollector(socket, next) {
        if (!socket.session.userId) {
            return next();
        }

        users[socket.session.userId] || (users[socket.session.userId] = {
            connections: new SimpleMetric('connections')
        });

        aggregates.connections.set(global.io.sockets.sockets.length);

        if (socket.stats.connections.current === 0) {
            aggregates.users.online.increment();

            if (socket.stats.last_seen) {
                aggregates.users.offline.decrement();
            }
        }

        socket.stats.last_seen = new Date();
        socket.stats.connections.increment();

        function disconnectHandler (socket) {
            aggregates.connections.set(global.io.sockets.sockets.length);

            socket.stats.connections.decrement();
            socket.stats.last_seen = new Date();

            if (socket.stats.connections.current === 0) {
                aggregates.users.online.decrement();
                aggregates.users.offline.increment();
            }
        }

        socket.on('disconnect', disconnectHandler);
        socket.on('error', disconnectHandler);

        next();
    };
}

module.exports = ioStats;