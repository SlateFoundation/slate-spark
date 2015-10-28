var db = require('../../lib/database'),
    JsonApiError = require('../../lib/error').JsonApiError,
    Promise = require('bluebird'),
    util = require('../../lib/util'),
    lookup = require('../../lib/lookup');

function getHandler(req, res, next) {
    if (util.requireParams(['section_id'], req, res)) {
        return next();
    }

    var sectionId = req.params.section_id,
        query = `
       SELECT ssas.student_id,
              ssas.sparkpoint_id,
              ssas.section_id AS section,
              ss.learn_start_time,
              ss.learn_finish_time,
              ss.conference_start_time,
              ss.conference_join_time,
              ss.conference_finish_time,
              ss.apply_start_time,
              ss.apply_ready_time,
              ss.apply_finish_time,
              ss.assess_start_time,
              ss.assess_ready_time,
              ss.assess_finish_time
         FROM section_student_active_sparkpoint ssas
    LEFT JOIN student_sparkpoint ss ON ss.student_id = ssas.student_id
          AND ss.sparkpoint_id = ssas.sparkpoint_id
        WHERE ssas.section_id = $1;
  `;

    db(req).manyOrNone(query, [sectionId]).then(function (activities) {
        res.json(activities.map(function(activity) {
            var sparkpointCode = lookup.sparkpoint.idToCode[activity.sparkpoint_id];

            if (sparkpointCode) {
                activity.sparkpoint = sparkpointCode;
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

function patchHandler(req, res, next) {
    if (util.requireParams(['student_id', 'section_id', 'sparkpoint_id'], req, res)) {
        return next();
    }

    var sectionId = req.params.section_id,
        studentId = req.studentId,
        sparkpointId = req.params.sparkpoint_id,
        allKeys = Object.keys(req.body || {}),
        allowedKeys = [
            'sparkpoint',
            'learn_start_time',
            'learn_finish_time',
            'conference_start_time',
            'conference_join_time',
            'conference_finish_time',
            'apply_start_time',
            'apply_ready_time',
            'apply_finish_time',
            'assess_start_time',
            'assess_ready_time',
            'assess_finish_time'
        ],
        activeSql,
        sparkpointSql,
        invalidKeys = [],
        timeKeys = [],
        updateValues = [],
        timeValues = [];

    // This filter also sets timeKeys and timeValues
    invalidKeys = allKeys.filter(function(key) {
        var val;

        if (key.indexOf('time') !== -1) {
            val = parseInt(req.body[key], 10);

            if (!isNaN(val)) {
                val = "'" + new Date(val * 1000).toUTCString() + "'";
                timeKeys.push(key);
                timeValues.push(val);
                updateValues.push(`${key} = ${val}`);
            }
        }

        return allowedKeys.indexOf(key) === -1;
    });

    if (invalidKeys.length > 1) {
        res.statusCode = 400;
        res.json({
            error: 'Unexpected field(s) encountered: ' + invalidKeys.join(', '),
            body: req.body,
            params: req.params
        });

        return next();
    }

    activeSql = `
        INSERT INTO section_student_active_sparkpoint
                    (section_id, student_id, sparkpoint_id)
             VALUES ($1, $2, $3)
        ON CONFLICT (section_id, student_id) DO UPDATE
                SET sparkpoint_id = $3`;

    db(req).none(activeSql, [sectionId, studentId, sparkpointId]).then(function() {
        if (timeKeys.length === 0) {
            // Return existing row, no time updates
            sparkpointSql = `
                SELECT *
                  FROM student_sparkpoint
                 WHERE student_id = $1
                   AND sparkpoint_id = $2;
            `;

            db(req).oneOrNone(sparkpointSql, [studentId, sparkpointId]).then(function(record) {
                if (record) {
                    delete record.id;
                    res.json(record);
                    return next();
                } else {
                    record = {
                        student_id: studentId,
                        sparkpoint_id: sparkpointId
                    };

                    allowedKeys.forEach(function(key) {
                        if (key === 'sparkpoint') {
                            record.sparkpoint = lookup.sparkpoint.idToCode[sparkpointId];
                        } else {
                            record[key] = null;
                        }
                    });

                    res.json(record);
                    return next();
                }
            }, function (error) {
                res.statusCode = 500;
                res.json({error: error});
                return next();
            });
        } else {
            // Upsert time updates, return updated row
            sparkpointSql = `INSERT INTO student_sparkpoint (student_id, sparkpoint_id,  ${timeKeys.join(', ')}) VALUES ($1, $2, ${timeValues.join(', ')}) ON CONFLICT (student_id, sparkpoint_id) DO UPDATE SET ${updateValues.join(',\n')} RETURNING *;`;

            db(req).one(sparkpointSql, [studentId, sparkpointId]).then(function(record) {
                delete record.id;
                res.json(record);
                return next();
            }, function(error) {
                res.statusCode = 500;
                res.json({error: error});
                return next();
            });
        }
    }, function(err) {
        res.statusCode = 500;
        res.json({error: err});
        next();
    });
}

module.exports = {
    get: getHandler,
    patch: patchHandler,
};
