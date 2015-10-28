var db = require('../../lib/database'),
    util = require('../../lib/util');

/*
 SET SEARCH_PATH = "sandbox-school", "public";

 CREATE TABLE learn_reviews (
 id serial PRIMARY KEY,
 resource_id integer,
 student_id integer,
 rating smallint,
 comment text,

 UNIQUE (resource_id, student_id);
 );

 ALTER TABLE learn_reviews OWNER TO "sandbox-school";

 CREATE TABLE apply_reviews (
 id serial PRIMARY KEY,
 apply_id integer,
 student_id integer,
 rating smallint,
 comment text,

 UNIQUE (apply_id, student_id);
 );

 ALTER TABLE apply_reviews OWNER TO "sandbox-school";
 */

function patchHandler(entity, entityId, tableName) {
    return function(req, res, next) {
        if (util.requireParams(['student_id'], req, res)) {
            return next();
        }

        if (!Array.isArray(req.body)) {
            res.json({error: 'request body should be an array', body: req.body });
            return next();
        }

        var inserts = [],
            x = 0,
            studentId = req.params.student_id,
            values = [studentId],
            selects = [];

        req.body.forEach(function(review) {
            var rating = review.rating,
                comment = review.comment,
                keys = Object.keys(review),
                vals = [],
                sets = [],
                prefix = (x > 0 ? '     ' : 'WITH ');

            keys.forEach(function(key) {
                var idx = values.push(review[key]);
                vals.push('$' + idx);
                if (key !== entityId) {
                    sets.push(key + ' = $' + idx);
                }
            });

            if (!isNaN(review[entityId]) && (typeof rating === 'number' || typeof comment === 'string')) {
                inserts.push(`
${prefix}d${++x} AS (
    INSERT INTO ${tableName} (student_id, ${Object.keys(review).join(', ')}) VALUES($1, ${vals.join(', ')})
    ON CONFLICT (student_id, ${entityId}) DO UPDATE SET
    ${sets.join(', ')}
    RETURNING student_id, ${entityId}, rating, comment
)`);
            } else {
                res.statusCode = 400;
                res.json({
                    error: `Reviews should contain a ${entityId} and one or more of the following: rating, comment`,
                    review: review
                });
                return next();
            }

            selects.push(`SELECT * FROM d${x}`);
        });

        if (inserts.length === 0) {
            res.statusCode = 400;
            res.json({ error: 'You must pass at least one review.', body: req.body, params: req.params });
            return next();
        }

        query = inserts.join(',\n') + '\n' + selects.join('\nUNION ALL\n') + ';';

        db(req).any(query, values).then(function(result) {
            res.json(result);
            return next();
        }, function(error) {
            res.statusCode = 500;
            res.json({ error: error, query: query });
            return next();
        });
    };
}

module.exports = {
    patch: patchHandler
};