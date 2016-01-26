'use strict';

/*
CREATE TABLE IF NOT EXISTS help_requests(
    id serial,
    student_id integer,
    section_id integer,
    request_type text,
    open_time TIMESTAMP without TIME ZONE,
    close_time TIMESTAMP without TIME ZONE,
    closed_by integer,

    PRIMARY KEY(id)
);

CREATE INDEX IF NOT EXISTS help_requests_student_id_idx ON help_requests (student_id);
CREATE INDEX IF NOT EXISTS help_requests_section_id_idx ON help_requests (section_id);
CREATE INDEX IF NOT EXISTS help_requests_section_open_time ON help_requests (open_time) WHERE open_time IS NULL;
*/

function Values(vals) {
    this.vals = vals || [];
}

Values.prototype.push = function(val) {
    var idx = this.vals.indexOf(val);

    if (idx === -1) {
        return '$' + this.vals.push(val);
    } else {
        return '$' + (idx + 1);
    }
};

function *getHandler() {
    this.body = yield util.selectFromRequest.call(this, 'help_requests');
}

function *patchHandler(req, res, next) {
    var ctx = this,
        body = this.request.body,
        inserts = [],
        updates = [],
        vals = new Values(),
        order = [];

    if (!Array.isArray(body)) {
        return this.throw(400, new Error('Request body must be a JSON encoded array of help request objects'));
    }

    var validationErrors = body.map(function(request) {
        if (request.id === undefined) {
            // Allow INSERT in PATCH
            if (ctx.isStudent) {
                request.student_id = ctx.userId;
                if (request.section_id === undefined) {
                    request.section_id = ctx.query.section_id;
                }
            }

            order.push('i' + inserts.push(request));
            return ctx.validation.help_requests(request);
        } else {
            order.push('u' + updates.push(request));
            if (request.student_id !== undefined && ctx.isStudent && request.student_id !== ctx.userId) {
                ctx.throw(403, new Error(
                    'The student_id of a help request cannot be changed by a student to another student.'
                ));
            }
        }
    }).filter(function(errors) {
        return Array.isArray(errors);
    });

    if (validationErrors.length > 0) {
        return this.throw(400, new Error(validationErrors.join(', ')));
    } else {
        body = body.map(function(request) {
           if (request.section_id === undefined && request.id === undefined && ctx.query.section_id) {
               request.section_id = ctx.query.section_id;
           }

            if (request.section_code) {
                request.section_id = ctx.lookup.section.cache.codeToId[request.section_code.toLowerCase()];
                delete request.section_code;
            }

            if (request.close_time) {
                request.closed_by = ctx.userId;
            }

            if (ctx.isStudent && !request.id) {
                request.student_id = ctx.userId;
            }

            return request;
        });

        inserts = inserts.map(function(record) {
            var cols = [], placeholders = [];

            for (var col in record) {
                var val = record[col];
                cols.push(col);
                placeholders.push(vals.push(val));
            }

            return `INSERT INTO help_requests (${cols.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;
        });

        updates = updates.map(function(record) {
            var sql = 'UPDATE help_requests SET ',
                sets = [];

            for (var col in record) {
                if (col !== 'id') {
                    sets.push(`${col} = ${vals.push(record[col])}`);
                }
            }

            sql += sets.join(', ');

            // Students can only PATCH their own help requests
            let acl = '1=1';

            if (ctx.isStudent) {
                acl = `student_id = ${vals.push(ctx.userId)}`;
            }

            return sql + `WHERE id = ${record.id} AND ${acl} RETURNING *`;
        });

        var insertLen = inserts.length,
            updateLen = updates.length;

        var sql = 'WITH ';

        if (insertLen) {
            sql += inserts.map(function(insert, idx) {
                var sql = 'i' + (idx + 1) + ' AS (\n\t' + insert + '\n)';

                if (idx < (insertLen - 1) || (idx === (insertLen - 1) && updateLen > 0)) {
                    sql += ', ';
                }

                return sql;
            }).join('');
        }

        if (updateLen) {
            if (insertLen === 0) {
                sql += '\n';
            }

            sql += updates.map(function(update, idx) {
                var sql = 'u' + (idx + 1) + ' AS (\n\t' + update + '\n)';

                if (idx < (updateLen - 1)) {
                    sql += ', ';
                }

                return sql;
            }).join('');
        }
    }

    sql += '\n\nSELECT * FROM (\n';
    sql += order.map(table => `SELECT * FROM ${table}\n`).join('UNION ALL\n');
    sql += '\n) results;';

    this.body = yield this.pgp.any(sql, vals.vals);
}

function *postHandler (req, res, next) {
    var body = this.request.body;

    if (typeof body !== 'object' || Array.isArray(body)) {
        return this.throw(400, new Error('The request body must be a single JSON encoded help request object'));
    }

    if (body.id !== undefined) {
        return this.throw(400, new Error('Existing help requests must be modified using PATCH'));
    }

    if (this.query.section_id) {
        body.section_id = this.query.section_id;
    }

    if (body.section_code) {
        body.section_id = ctx.lookup.section.cache.codeToId[body.section_code.toLowerCase()];
        delete request.section_code;
    }

    if (this.isStudent) {
        body.student_id = this.userId;
    } else {
        return this.throw(400, new Error('Non-student users must provide student_id explicitly (did you mean to do this?)'));
    }

    var validationErrors = this.validation.help_requests(body);

    if (Array.isArray(validationErrors)) {
        return this.throw(400, new Error(validationErrors.join(', ')));
    }

    let columns = Object.keys(body);
    let values = new Values();
    let placeholders = columns.map(col => values.push(body[col]));
    let query = `INSERT INTO help_requests (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING * `;

    this.body = yield this.pgp.one(query, values.vals);
}

module.exports = {
    get: getHandler,
    post: postHandler,
    patch: patchHandler
};
