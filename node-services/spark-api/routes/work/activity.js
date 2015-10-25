var db = require('../../lib/database'),
    JsonApiError = require('../../lib/error').JsonApiError,
    Promise = require('bluebird'),
    util = require('../../lib/util'),
    lookup = require('../../lib/lookup');

function getHandler(req, res, next) {
    var sectionId = req.params['section-id'] || req.params.section;

    if (!sectionId) {
        res.send(400, 'sectionid is required.');
        return next();
    }

    var query = `
        SELECT ss.*
          FROM section_student_active_sparkpoint ssas
          JOIN student_sparkpoint ss ON ss.student_id = ssas.student_id
           AND ss.sparkpoint_id = ssas.sparkpoint_id
         WHERE ssas.section_id = $1
           AND ss.assess_finish_time IS NULL`;

    db(req).manyOrNone(query, [sectionId]).then(function (activities) {
        res.json(activities.map(function(activity) {
            var sparkpointCode = lookup.sparkpoint.idToCode[activity.sparkpoint_id];

            if (sparkpointCode) {
                activity.sparkpoint_code = sparkpointCode;
            }

            delete activity.id;

            return activity;
        }));

        return next();
    }, function (error) {
        res.send(500, new JsonApiError(error));
        return next();
    });
}

function postHandler(req, res, next) {
    var sectionId = req.params['section-id'] || req.params.section,
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

    db(req).one(sql, [userId, sparkpointId, sectionId, duration, phase, complete]).then(function (activity) {
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
