'use strict';

var config = JSON.parse(process.env.SPARK_REALTIME),
    middleware = require('./middleware/index'),
    http = require('http'),
    nats = require('nats').connect(config.nats),
    server = http.createServer(),
    pg = require('pg').native,
    connString,
    sparkpoints = {},
    sections = {},
    sectionPeople = {},
    personSections = {},
    io;

// TODO: Add real logging framework
console._log = console.log;

console.log = function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(`[${config.schema}]`);
    console._log.apply(this, args);
};

function initDatabase() {
    var cfg = config.postgresql;

    if (!cfg) {
        throw new Error(`${config.schema} is missing a valid postgresql section from its configuration`);
    }

    let missingKeys = ['database', 'username', 'host', 'password'].filter(key => cfg[key] === undefined);

    if (missingKeys.length > 0) {
        throw new Error(
            `${config.schema} is missing the following key(s) from its postgresql config: ${missingKeys.join(',')}`
        );
    }

    connString = `postgres://${cfg.username}:${cfg.password}@${cfg.host}/${cfg.database}?application_name=spark-realtime`;

    // Test connection
    pg.connect(connString, function(err, client, done) {
        if (err) {
            console.error(err);
            throw new Error(`Unable to connect to ${cfg.database} PostgreSQL database on ${cfg.host}`);
        }

        console.log(`Connected to ${cfg.database} PostgreSQL database on ${cfg.host}`);

        let sql = `
            WITH section_people AS (
                SELECT "CourseSectionID" AS section,
                       json_agg("PersonID") AS people
                  FROM course_section_participants
              GROUP BY "CourseSectionID"
            ), person_sections AS (
                SELECT p."ID" AS person,
                       array_agg("CourseSectionID") AS sections
                  FROM people p
                  JOIN course_section_participants csp ON csp."PersonID" = p."ID"
              GROUP BY p."ID"
            )

            SELECT json_build_object(
                'sections', (SELECT json_object_agg("ID", "Code") FROM course_sections),
                'sparkpoints', (SELECT json_object_agg(id, code) FROM sparkpoints),
                'section_people', (SELECT json_object_agg(section, people) FROM section_people),
                'person_sections', (SELECT json_object_agg(person, sections) FROM person_sections),
                'counts', json_build_object(
                    'sections', (SELECT count(1) FROM course_sections),
                    'sparkpoints', (SELECT count(1) FROM sparkpoints),
                    'section_people', (SELECT  count(1) FROM section_people),
                    'person_sections', (SELECT count(1) FROM person_sections)
                )
            ) AS lookup;
        `;

        client.query(sql, [], function(err, results) {
            if (err) {
                console.log('Error populating lookup tables');
                throw err;
            }

            let lookup = results.rows[0].lookup;

            sparkpoints = lookup.sparkpoints;
            sections = lookup.sections;
            sectionPeople = lookup.section_people;
            personSections = lookup.person_sections;

            for (let entity in lookup.counts) {
                console.log(`${lookup.counts[entity].toLocaleString()} entries in ${entity} lookup table`);
            }
        });

        initMiddleware();
    });
}

function query(sql, values, cb) {
    pg.connect(connString, function(err, client, done) {

        if (err) {
            if (client) {
                done(client);
            }

            return cb && cb(err, null);
        }

        client.query(sql, values, function(err, result) {

            if (err) {
                if (client) {
                    done(client);
                }

                return cb && cb(err, null);
            }

            cb && cb(null, result.rows);

            done(client);
        });
    });
}

function initMiddleware() {
    config.middleware = config.middleware || {};

    config.middleware.stats = config.middleware.stats || {};
    config.middleware.stats.httpServer = server;

    // We must initialize the middleware prior to initializing socket.io in order to attach any http request handlers
    for (var name in middleware) {
        middleware[name] = middleware[name](config.middleware[name] || {});
    }

    io = global.io = require('socket.io')(server);

    (config.middleware.load_order || Object.keys(middleware)).forEach(function(name) {
        io.use(middleware[name]);
    });

    initNats();
}

function initServer() {
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

            sections[data.section] || (sections[data.section] = { teachers: [], students: [] });

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
            sections[data.section] || (sections[data.section] = { teachers: [], students: [] });

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

    server.listen(config.port);

    console.log(`Listening on ${config.port}`);
}

initDatabase();

const USER_ID_COLUMNS = [
    'PersonID',
    'user_id',
    'student_id',
    'teacher_id',
    'person_id',
    'recommender_id',
    'author_id'
];

function extractUserIds(data, userIds) {
    USER_ID_COLUMNS.forEach(function(key) {
        let userId = data[key];

        if (userId && typeof userId === 'number') {
            userIds.add(userId)
        }
    });
}

function initNats() {
    nats.subscribe(config.schema + '.>', function (msg) {
        var stats = global.stats,
            identified = false,
            sent = false,
            userIds,
            data;

        if (!msg) {
            stats.aggregates.nats.dropped.increment();
            return;
        }

        msg = JSON.parse(msg);

        if (!msg.item || config.ignore.indexOf(msg.table) !== -1) {
            stats.aggregates.nats.ignored.increment();
            return;
        }

        userIds = new Set();

        if (config.broadcast) {
            stats.aggregates.outgoing.broadcast.increment();
            return io.emit('db', msg);
        }

        data = msg.item;

        extractUserIds(data, userIds);

        // Time to decorate! Let's start with a festive spark point
        if (data.section_id && data.section_code === undefined) {
            data.section_code = sections[data.section_id];
        }

        if (data.sparkpoint_id && data.sparkpoint_code === undefined) {
            data.sparkpoint_code = sparkpoints[data.sparkpoint_id];
        }

        if (msg.table === 'people') {
            userIds.add(data.ID);
        }

        // IMPORTANT: Right now, only rows with a section_id column are being broadcast to course section participants this
        // may or may not be "correct" behavior. If we need to expand this, it's likely that we should add an abstraction
        // layer where emitting a student event will relay that to all other course participants (including the teacher)

        if (data.section_id) {
            if (config.section_broadcast) {
                sectionPeople[data.section_id].forEach(function(userId) {
                    userIds.add(userId);
                });
            } else {
                identified = true;
                sent = true;
                io.to('section:' + sections[data.section_id]).emit('db', msg);
            }
        }

        if (!sent) {
            userIds.forEach(function(userId) {
                identified = true;

                if (msg.table === 'help_requests') {
                    msg.can_delete = (userId === msg.student_id);
                }

                io.to('user:' + userId).emit('db', msg);
            });
        }

        if (identified) {
            stats.aggregates.outgoing.identified.increment();
            console.log(data);
            console.log('Recipients: ', Array.from(userIds).join(', '));
        } else {
            stats.aggregates.outgoing.unidentified.increment();
            console.log('Unable to associate database event with user:');
            console.log(msg);
        }
    });

    initServer();
}

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
