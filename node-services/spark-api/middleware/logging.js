'use strict';

var mkdirp = require('mkdirp-then'),
    fs = require('co-fs'),
    dirCreated = false,
    logToFile,
    jsonHandle,
    textHandle,
    path = require('path');

module.exports = function *logger(next) {
    var start = new Date,
        config = this.app.context.config.logging,
        logDirectory = config.log_directory,
        error,
        textLogString,
        jsonLogString;

    if (config.stdout_format === 'json' && config.stdout_sql) {
        console.error('stdout_sql cannot be true when the stdout_format is set to JSON; disabling stdout_sql.');
        config.stdout_sql = false;
    }

    if (!dirCreated && logToFile !== false) {
        try {
            let stats = yield fs.stat(logDirectory);

            if (stats.isDirectory()) {
                dirCreated = true;
            }
        } catch (err) {
            error = err;

            if (err.code === 'ENOENT') {
                // Directory does not exist
                try {
                    yield mkdirp(logDirectory);
                    yield fs.chown(logDirectory, process.geteuid(), process.getegid());
                    dirCreated = true;
                } catch (e) {
                    error = e;''
                    dirCreated = false;
                }
            } else if (err.code === 'EACCE') {
                // Directory is not writeable
                try {
                    yield fs.chown(logDirectory, process.geteuid(), process.getegid());
                    dirCreated = true;
                } catch (e) {
                    error = e;
                }
            }
        }

        if (!dirCreated) {
            logToFile = false;
            console.error(`Logs cannot be output to disk! Unable to create/chown: ${logDirectory} (${error})`);
        } else {
            if (config.json_filename) {
                jsonHandle = require('fs').createWriteStream(path.join(logDirectory, config.json_filename), {
                    flags: 'w',
                    encoding: 'utf8',
                    mode: '0666'
                });
            }

            if (config.text_filename) {
                textHandle = require('fs').createWriteStream(path.join(logDirectory, config.text_filename), {
                    flags: 'w',
                    encoding: 'utf8',
                    mode: '0666'
                });
            }

            logToFile = true;
        }
    }

    this.log = {
      method: this.method,
      path: this.path,
      ts: start,
      sql: [],
      warnings: [],
      errors: [],
    };

    yield next;

    if (config.stdout_request_body && config.stdout_format === 'json') {
        this.log.request_body = {
            original: JSON.parse(this.original.body),
            effective: this.request.body
        };
    }

    var ms = new Date - start;

    this.log.duration = ms;
    this.log.user = {
        name: this.username,
        id: this.userId,
        schema: this.schema
    };

    textLogString = `[${start.toUTCString()}] - ${this.method} ${this.url} - ${ms}ms - ${this.username} - ${this.schema}`;

    if (this.requestId) {
        this.set('X-Request-Id', this.requestId);
        this.log.request_id = this.requestId;
        textLogString += ` - ${this.requestId}`;
    }

    if (this.app.context.git) {
        let git = this.app.context.git;

        for (var prop in git) {
            this.set('X-Git-' + prop.slice(0,1).toUpperCase() + prop.substr(1), git[prop]);
        }

        this.log.git = git;

        textLogString += ` - ${git.branch}@${git.commit}`;
    }

    if (logToFile) {
        if (jsonHandle) {
            jsonLogString = JSON.stringify(this.log);
            jsonHandle.write("\n" + jsonLogString);
        }

        if (textHandle) {
            textHandle.write("\n" + textLogString);
        }
    }

    if (config.stdout_format === 'json') {
        console.log(jsonLogString);
    } else if (config.stdout_format === 'text') {
        console.log(textLogString);
        if (config.stdout_request_body && this.request.body) {
            console.log(this.original.body);
        }
    }
};
