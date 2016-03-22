'use strict';

var mkdirp = require('mkdirp-then'),
    fs = require('co-fs'),
    dirCreated = false,
    logToFile,
    jsonHandle,
    textHandle,
    blueprintHandle,
    path = require('path');

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

                process.on('exit', function () {
                    // Flush logs to disk
                    jsonHandle.end();
                });
            }

            if (config.text_filename) {
                textHandle = require('fs').createWriteStream(path.join(logDirectory, config.text_filename), {
                    flags: 'a',
                    encoding: 'utf8',
                    mode: '0666'
                });

                process.on('exit', function () {
                    // Flush logs to disk
                    textHandle.end();
                });
            }

            if (config.blueprint_filename) {
                let blueprintPath = path.join(logDirectory, config.blueprint_filename),
                    writeHeader = false;

                try {
                    let stats = yield fs.stat(blueprintPath);

                    if (!stats.isFile()) {
                        writeHeader = true;
                    }
                } catch (e) {
                    writeHeader = true;
                }

                blueprintHandle = require('fs').createWriteStream(blueprintPath, {
                    flags: 'a',
                    encoding: 'utf8',
                    mode: '0666'
                });


                if (writeHeader) {
                    blueprintHandle.write('FORMAT: 1A\n');
                    blueprintHandle.write(`HOST: http://${ctx.host}\n`);
                    blueprintHandle.write('\n# spark-api\n');
                    blueprintHandle.write('\n::: note\n');
                    blueprintHandle.write('This was automatically generated by spark-api using incoming requests.\n');
                    blueprintHandle.write('::::\n\n');
                }
            }

            logToFile = true;
        }
    }

    ctx.log = {
      method: this.method,
      path: this.path,
      ts: start
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
            ctx.log.query = ctx.original ? ctx.original.queryObject : ctx.query;
            ctx.log.request = ctx.request;
            ctx.log.response = ctx.response;

            jsonLogString = JSON.stringify(ctx.log);

            if (config.json_log_body) {
                jsonLogString = JSON.parse(jsonLogString);

                if (ctx.orginal) {
                    jsonLogString.request.body = ctx.original ? ctx.original.body : ctx.request.body;
                    if (ctx.request.is('json')) {
                        jsonLogString.request.body = JSON.parse(jsonLogString.request.body);
                    }
                }

                jsonLogString.response.body = ctx.response.is('json') ? JSON.parse(ctx.body) : ctx.body;
                jsonLogString = JSON.stringify(jsonLogString);
            }

            jsonHandle.write(jsonLogString + '\n', 'utf-8');
        }

        if (textHandle) {
            textHandle.write(textLogString + '\n', 'utf-8');
        }
    }

    if (config.stdout_format === 'json') {
        console.log(jsonLogString);
    } else if (config.stdout_format === 'text') {
        console.log(textLogString);
        if (config.stdout_request_body && ctx.request.body && ctx.original) {
            console.log(ctx.original.body);
        }
    }

    if (config.blueprint_filename) {
        let blueprint = format(ctx);

        if (blueprint) {
            blueprintHandle.write(blueprint);
        }
    }
};

function format (ctx) {
    if (typeof ctx.original !== 'object') {
        return;
    }

    var reqBody = (typeof ctx.request.body === 'object') ? JSON.stringify(ctx.request.body, null, '\t') : ctx.request.body || '',
        resBody = (typeof ctx.response.body === 'object') ? JSON.stringify(ctx.response.body, null, '\t') : ctx.response.body || '',
        queryParams = Object.keys(ctx.original.queryObject || {}),
        output = [];

    if (queryParams.length > 0) {
        queryParams = `/{?${queryParams.join(',')}`;
        output.push(`# [${ctx.path}${queryParams}]`);
    } else {
        output.push(`# ${ctx.path}`);
    }

    output.push(`+ Request`);

    if (queryParams !== '') {
        output.push(`   + Parameters`);

        Object.keys(ctx.original.queryObject || {}).forEach(key => {
            output.push(`       + ${key} (${typeof ctx.original.queryObject[key]}) - todo`);
        });

        output.push(``);
    }

    output.push(`   + Headers`);
    output.push(``);

    Object.keys(ctx.request.headers).forEach(function(key) {
        output.push(`            ${key}:${ctx.request.headers[key]}`);
    });

    output.push(``);
    output.push(`   + Body`);
    output.push(``);

    reqBody.split('\n').forEach(function(line) {
        output.push(`           ${line}`);
    });

    output.push(``);

    output.push(`+ Response ${ctx.status}`);
    output.push(`   + Headers`);

    output.push(``);

    Object.keys(ctx.response.headers).forEach(function(key) {
        output.push(`            ${key}:${ctx.response.headers[key]}`);
    });

    output.push(``);
    output.push(`   + Body`);
    output.push(``);

    resBody.split('\n').forEach(function(line) {
        output.push(`           ${line}`);
    });

    output.push(``);

    return output.join('\n');
}
