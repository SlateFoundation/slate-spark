'use strict';

var mkdirp = require('mkdirp-then'),
    fs = require('co-fs'),
    dirCreated = false,
    logToFile,
    jsonHandle,
    textHandle,
    blueprintHandle,
    path = require('path'),
    bf, aglio;

module.exports = function *logger(next) {
    var start = new Date,
        config = this.app.context.config.logging,
        logDirectory = config.log_directory,
        error,
        textLogString,
        jsonLogString,
        ctx = this;

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
                    error = e;
                    dirCreated = false;
                }
            } else if (err.code === 'EACCE') {
                // Directory is not writable
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
                    flags: 'a',
                    encoding: 'utf8',
                    mode: '0666'
                });
            }

            if (config.text_filename) {
                textHandle = require('fs').createWriteStream(path.join(logDirectory, config.text_filename), {
                    flags: 'a',
                    encoding: 'utf8',
                    mode: '0666'
                });
            }

            if (config.blueprint_filename) {
                blueprintHandle = require('fs').createWriteStream(path.join(logDirectory, config.blueprint_filename), {
                    flags: 'a',
                    encoding: 'utf8',
                    mode: '0666'
                });

                bf = require('api-blueprint-http-formatter');
            }

            logToFile = true;
        }
    }

    ctx.log = {
      method: this.method,
      path: this.path,
      ts: start,
      sql: [],
      warnings: [],
      errors: [],
    };

    yield next;

    if (config.stdout_request_body && config.stdout_format === 'json') {
        ctx.log.request_body = {
            original: JSON.parse(ctx.original.body),
            effective: ctx.request.body
        };
    }

    var ms = new Date - start;

    ctx.log.duration = ms;
    ctx.log.user = {
        name: ctx.username,
        id: ctx.userId,
        schema: ctx.schema
    };

    textLogString = `[${start.toUTCString()}] - ${ctx.method} ${ctx.url} - ${ms}ms - ${ctx.username} - ${ctx.schema}`;

    if (ctx.requestId) {
        ctx.set('X-Request-Id', ctx.requestId);
        ctx.log.request_id = ctx.requestId;
        textLogString += ` - ${ctx.requestId}`;
    }

    if (ctx.app.context.git) {
        let git = ctx.app.context.git;

        for (var prop in git) {
            ctx.set('X-Git-' + prop.slice(0,1).toUpperCase() + prop.substr(1), git[prop]);
        }

        ctx.log.git = git;

        textLogString += ` - ${git.branch}@${git.commit}`;
    }

    if (logToFile) {
        if (jsonHandle) {
            jsonLogString = JSON.stringify(ctx.log);
            jsonHandle.write('\n' + jsonLogString, 'utf-8');
        }

        if (textHandle) {
            textHandle.write('\n' + textLogString, 'utf-8');
        }
    }

    if (config.stdout_format === 'json') {
        console.log(jsonLogString);
    } else if (config.stdout_format === 'text') {
        console.log(textLogString);
        if (config.stdout_request_body && ctx.request.body) {
            console.log(ctx.original.body);
        }
    }

    if (config.blueprint_filename) {
        blueprintHandle.write('\n' + bf.format({
            request: {
                method: ctx.method,
                uri: ctx.url.split('?')[0] + Object.keys(ctx.original.queryObject).map(param => {
                    var prefix = '';

                    // Mark non-required parameters as optional (uses ctx.require)
                    if (ctx.requiredParameters) {
                        if (ctx.requiredParameters.indexOf(param) === -1) {
                            prefix = '?';
                        }
                    }

                    return '{' + prefix + param + '}';
                }).join(''),
                headers: ctx.request.headers,
                body: typeof ctx.request.body === 'object' ? JSON.stringify(ctx.request.body) : ctx.request.body || ''
            },
            response: {
                headers: ctx.response.headers,
                statusCode: ctx.status,
                body: typeof ctx.response.body === 'object' ? JSON.stringify(ctx.response.body) : ctx.response.body || ''
            }
        }), 'utf-8');
    }
};
