var db = require('../../lib/database'),
    JsonApiError = require('../../lib/error').JsonApiError,
    Promise = require('bluebird'),
    util = require('../../lib/util'),
    lookup = require('../../lib/lookup');

function parseSession(req, res, next) {
    var session = {};

    if (req.headers['x-nginx-session']) {
        try {
            session = JSON.parse(req.headers['x-nginx-session']);
        } catch (e) {
            next(new errors.InvalidContentError('Invalid JSON in x-nginx-session: ' +
                e.message));
            return;
        }

        req.session = session;

        if (!req.session) {
            res.statusCode = 403;
            res.json({error: 'Authorization required', success: false});
            return next();
        }
    }
}

function getHandler(req, res, next) {
    var sectionId = req.params['section-id'] || req.params.section_id || req.params.sectionId || req.params.sectionid;

    if (!sectionId) {
        res.send(400, 'sectionid is required.');
        return next();
    }

    parseSession(req, res, next);

    var query = `
    SELECT a1.*
      FROM activity AS a1
INNER JOIN (SELECT user_id,
                   MAX(last_active) AS last_active_max
              FROM activity
          GROUP BY user_id) AS a2
       ON a1.user_id = a2.user_id
      AND a1.last_active = a2.last_active_max
    WHERE complete = false
      AND section_id = $1`;

    db.manyOrNone(query, [sectionId]).then(function (activities) {
        res.json(activities.map(function(activity) {
            var sparkpointCode = lookup.sparkpoint.idToCode[activity.sparkpoint_id];

            if (sparkpointCode) {
                activity.sparkpoint_code = sparkpointCode;
            }

            return activity;
        }));

        return next();
    }, function (error) {
        res.send(500, new JsonApiError(error));
        return next();
    });
}

function postHandler(req, res, next) {
    parseSession(req, res, next);

    var sectionId = req.params['section-id'] || req.params.section_id || req.params.sectionId || req.params.sectionid,
        userId = req.params['user-id'] || req.params.user_id || req.params.userId || req.params.userid,
        phase = ('' + req.params.phase).toLowerCase(),
        duration = parseInt(req.params.duration, 10) || 0,
        complete = req.params.complete === 'true',
        sparkpointId = util.toSparkpointId(req.params.sparkpoint);

    if (!sparkpointId) {
        res.send(400, 'Invalid Sparkpoint Id: ' + sparkpointId);
        return next();
    }

    if (req.session.accountLevel === 'Student') {
        userId = req.session.userId;
    } else if (req.session.accountLevel !== 'Developer' || !userId) {
        res.send(400, 'This is a student only endpoint, you are logged in as a: ' + req.session.accountLevel);
        return next();
    }

    if (!sectionId) {
        res.send(400, 'Section ID is required.');
        return next();
    }

    if (phase !== 'learn' && phase !== 'conference' && phase !== 'apply' && phase !== 'assess') {
        res.send(400, 'A valid phase is required (learn, conference, apply, assess) you provided: ' + phase);
        return next();
    }

    var sql = `
    INSERT INTO activity (user_id, sparkpoint_id, section_id, ${phase}_duration, phase, complete)
                VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (user_id, sparkpoint_id, section_id)
  DO UPDATE SET ${phase}_duration = activity.${phase}_duration + $4,
                phase = $5,
                last_active = CURRENT_TIMESTAMP,
                complete = $6
      RETURNING *;`;

    db.one(sql, [userId, sparkpointId, sectionId, duration, phase, complete]).then(function (activity) {
        var sparkpointCode = lookup.sparkpoint.idToCode[activity.sparkpoint_id];

        if (sparkpointCode) {
            activity.sparkpoint_code = sparkpointCode;
        }

        res.json(activity);

        return next();
    }, function (err) {
        res.send(500, err);
        return next();
    });
}

module.exports = {
    get: getHandler,
    post: postHandler,
};
