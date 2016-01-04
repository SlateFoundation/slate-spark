'use strict';

var config = JSON.parse(process.env.SPARK_REALTIME),
    middleware = require('./middleware/index'),
    http = require('http'),
    nats = require('nats').connect(config.nats),
    server = global.httpServer = http.createServer(),
    io;

function initMiddleware() {
    config.middleware = config.middleware || {};

    // We must initialize the middleware prior to initializing socket.io in order to attach any http request handlers
    for (var name in middleware) {
        middleware[name] = middleware[name](config.middleware[name] || {});
    }

    io = global.io = require('socket.io')(server);

    (config.middleware.load_order || Object.keys(middleware)).forEach(function(name) {
        io.use(middleware[name]);
    });
}

initMiddleware();

server.listen(config.port);

io.use(function (socket, next) {
    var stats = global.stats,
        sections = stats.sections;

    socket.on('subscribe', function subscribe(data) {
        console.log(socket.session.username + ' subscribed to ' + data.section);

        stats.aggregates.subscriptions.increment();
        stats.aggregates.incoming.increment();

        socket.stats.subscriptions.increment();

        socket.join('section:' + data.section);
        socket.section = data.section;

        sections[data.section] || (sections[data.section] || { teachers: [], students: [] });

        if (socket.student) {
            if (sections[data.section].students.indexOf(socket.session.userId) === -1) {
                sections[data.section].students.push(socket.session.userId);
            }
        } else if (sections[data.section].teachers.indexOf(socket.session.userId) === -1) {
            sections[data.section].teachers.push(socket.session.userId);
        }
    });

    socket.on('unsubscribe', function unsubscribe(data) {
        var sections = global.stats.sections,
            idx;

        console.log(socket.session.username + ' unsubscribed from ' + data.section);

        stats.aggregates.subscriptions.decrement();
        stats.aggregates.incoming.increment();

        socket.leave('section:' + data.section);
        socket.section = null;
        sections[data.section] || (sections[data.section] || { teachers: [], students: [] });

        if (socket.isStudent) {
            idx = sections[data.section].students.indexOf(socket.session.userId);
            sections[data.section].students = sections[data.section].students.slice(idx, 1);
        } else {
            idx = sections[data.section].teachers.indexOf(socket.session.userId);
            sections[data.section].teachers = sections[data.section].teachers.slice(idx, 1);
        }
    });

    return next();
});

nats.subscribe(config.schema + '.>', function (msg) {
    var stats = global.stats,
        data, userId;

    if (!msg) {
        stats.nats.dropped.increment();
        return;
    }

    msg = JSON.parse(msg);

    if (!msg.item || config.ignore.indexOf(msg.table) !== -1) {
        stats.nats.ignored.increment();
        return;
    }

    if (config.broadcast) {
        stats.outgoing.broadcast.increment();
        return io.emit('db', msg);
    }

    data = msg.item;
    userId = data.PersonID || data.user_id || data.student_id || data.teacher_id || data.person_id;

    if (msg.table === 'people') {
        userId = msg.ID;
    }

    if (userId) {
        stats.outgoing.identified.increment();
        io.to('user:' + userId).emit('db', msg);
    } else {
        stats.outgoing.unidentified.increment();
        console.log('Unable to associate database event with user: ' + msg);
    }
});

process.on('uncaughtException', function (err) {
    var markdown, request, options;

    console.error(err.message);
    console.error(err.stack);

    if (config.slack && config.slack.webhookUrl) {
        request = require('request');
        markdown = err.message + '```' + err.stack + '```';

        options = {
            uri: config.slack.webhookUrl,
            method: 'POST',
            json: { text: markdown }
        };

        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('Notification successfully sent to Slack.');
            }
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});