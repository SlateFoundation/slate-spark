var config = JSON.parse(process.env.SPARK_REALTIME),
    nats = require('nats').connect(config.nats),
    io = require('socket.io').listen(config.port),
    sections = {};

io.use(function (socket, next) {
    var session = socket.request.headers['x-nginx-session'];

    if (session) {
        session = JSON.parse(session);

        socket.session = session;
        socket.section = null;
        socket.student = session.accountLevel === 'Student';

        socket.on('subscribe', function subscribe(data) {
            console.log(socket.session.username + ' subscribed to ' + data.section);
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
            if (socket.section && sections[socket.section]) {
                sections[socket.section].teacher = null;
            }
        });

        return next();
    }

    next(new Error('Authentication error'));
});

nats.subscribe(config.schema + '.>', function (msg) {
    var data, userId;

    msg = JSON.parse(msg);

    if (!msg.item || config.ignore.indexOf(msg.table) !== -1) {
        return;
    }

    if (config.broadcast) {
        return io.emit('db', msg);
    }

    data = msg.item;
    userId = data.PersonID || data.user_id || data.student_id || data.teacher_id || data.person_id;

    if (msg.table === 'people') {
        userId = msg.ID;
    }

    if (userId) {
        io.to('user:' + userId).emit('db', msg);
    } else {
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