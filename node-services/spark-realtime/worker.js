var config = JSON.parse(process.env.SPARK_REALTIME),
    nats = require('nats').connect(config.nats),
    server = require('http').createServer(requestHandler),
    io = require('socket.io')(server),
    stats = {
        connections: {
            peak: 0,
            current: 0,
            last_connection_at: null
        },

        subscriptions: {
            peak: 0,
            current: 0,
            last_subscription_at: null
        },

        incoming: {
            total: 0,
            last_message_at: null
        },

        outgoing: {
            broadcast: 0,
            total: 0,
            identified: 0,
            unidentified: 0,
            last_message_at: null
        },

        nats: {
            total_messages: 0,
            dropped_mesages: 0,
            ignored_messages: 0,
            last_message_at: null
        },

        users: {
            online: 0,
            offline: 0
        }
    },
    sections = {},
    userConnectionCount = {},
    userLastSeen = {};

function getOnlineUsers() {
    var online = [];

    for (var user in userConnectionCount) {
        if (userConnectionCount[user] > 0) {
            online.push(user);
        }
    }

    return online;
}

function getOfflineUsers() {
    var offline = [];

    for (var user in userConnectionCount) {
        if (userConnectionCount[user] <= 0) {
            offline.push(user);
        }
    }

    return offline;
}

function requestHandler(req, res) {
    var healthcheck;

    switch (req.url) {
        case '/healthcheck':
            stats.connections.current = io.sockets.sockets.length;
            stats.memory_usage = process.memoryUsage();
            stats.outgoing.total = (stats.outgoing.identified + stats.outgoing.broadcast);
            stats.users.online = getOnlineUsers().length;
            stats.users.offline = getOfflineUsers().length;
            res.end(JSON.stringify(stats, null, '\t'));
            break;

        case '/sections':
            res.end(JSON.stringify(sections, null, '\t'));
            break;

        case '/users/connection_count':
            res.end(JSON.stringify(userConnectionCount, null, '\t'));
            break;

        case '/users/last_seen':
            res.end(JSON.stringify(userLastSeen, null, '\t'));
            break;

        case '/users/online':
            res.send(JSON.stringify(getOnlineUsers(), null, '\t'));
            break;

        case '/users/offline':
            res.end(JSON.stringify(getOfflineUsers(), null, '\t'));
            break;

        case '/users':
            var users = {},
                connectionCount;

            for (var user in userConnectionCount) {
                connectionCount = userConnectionCount[user];

                users[user] = {
                    status: connectionCount  <= 0 ? 'offline' : 'online',
                    last_seen: userLastSeen[user],
                    connections: connectionCount
                };
            }

            res.end(JSON.stringify(users, null, '\t'));

            break;
        default:
            res.httpStatus = 404;
            res.end('File not found');
    }
}

io.use(function (socket, next) {
    var session = socket.request.headers['x-nginx-session'],
        connectionCount = io.sockets.sockets.length;

    stats.connections.last_connection_at = new Date();

    if (connectionCount > stats.max) {
        stats.peak_connections = connectionCount;
    }

    if (session) {
        session = JSON.parse(session);

        socket.session = session;
        socket.section = null;
        socket.student = session.accountLevel === 'Student';

        userConnectionCount[socket.session.username] || (userConnectionCount[socket.session.username] = 0);
        userConnectionCount[socket.session.username]++;
        userLastSeen[socket.session.username] = new Date();

        socket.on('subscribe', function subscribe(data) {
            console.log(socket.session.username + ' subscribed to ' + data.section);

            stats.subscriptions.last_subscription_at = new Date();
            stats.incoming.last_message_at = new Date();
            stats.incoming.total++;

            if (++stats.subscriptions.current > stats.subscriptions.peak) {
                stats.subscriptions.peak = stats.subscriptions.current;
            }

            socket.join('section:' + data.section);
            socket.section = data.section;
            sections[data.section] = sections[data.section] || {teachers: [], students: []};

            if (socket.student) {
                if (sections[data.section].students.indexOf(socket.session.userId) === -1) {
                    sections[data.section].students.push(socket.session.userId);
                }
            } else if (sections[data.section].teachers.indexOf(socket.session.userId) === -1) {
                sections[data.section].teachers.push(socket.session.userId);
            }
        });

        socket.on('unsubscribe', function unsubscribe(data) {
            var idx;

            stats.subscriptions.current--;
            stats.incoming.total++;

            console.log(socket.session.username + ' unsubscribed from ' + data.section);
            socket.leave('section:' + data.section);
            socket.section = null;
            sections[data.section] = sections[data.section] || {teachers: [], students: []};

            if (socket.student) {
                idx = sections[data.section].students.indexOf(socket.session.userId);
                sections[data.section].students = sections[data.section].students.slice(idx, 1);
            } else {
                idx = sections[data.section].teachers.indexOf(socket.session.userId);
                sections[data.section].teachers = sections[data.section].teachers.slice(idx, 1);
            }
        });

        socket.on('disconnect', function (socket) {
            if (socket.session) {
                userConnectionCount[socket.session.username]--;
                userLastSeen[socket.session.username] = new Date();
            }

            if (socket.section && sections[socket.section]) {
                sections[socket.section].teacher = null;
            }
        });

        return next();
    }

    next(new Error('Authentication error'));
});

server.listen(config.port);

nats.subscribe(config.schema + '.>', function (msg) {
    var data, userId;

    stats.nats.total_messages++;
    stats.nats.last_message_at = new Date();

    if (!msg) {
        stats.nats.dropped_mesages++;
        return;
    }

    msg = JSON.parse(msg);

    if (!msg.item || config.ignore.indexOf(msg.table) !== -1) {
        stats.nats.ignored_messages++;
        return;
    }

    if (config.broadcast) {
        stats.outgoing.last_message_at = new Date();
        stats.outgoing.broadcast++;
        return io.emit('db', msg);
    }

    data = msg.item;
    userId = data.PersonID || data.user_id || data.student_id || data.teacher_id || data.person_id;

    if (msg.table === 'people') {
        userId = msg.ID;
    }

    if (userId) {
        stats.outgoing.identified++;
        stats.outgoing.last_message_at = new Date();
        io.to('user:' + userId).emit('db', msg);
    } else {
        stats.outgoing.unidentified++;
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
                console.log('Notification successfully send to Slack.');
            }
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});