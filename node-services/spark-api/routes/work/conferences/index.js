'use strict';

var AsnStandard = require('../../../lib/asn-standard');

function* getHandler() {
    this.require(['sparkpoint_id', 'student_id']);

    var sparkpointId = this.query.sparkpoint_id,
        standardIds = [],
        userId = this.studentId,
        result,
        questions;

    (this.lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function(asnId) {
        standardIds = standardIds.concat(new AsnStandard(asnId).asnIds);
    });

    if (standardIds.length === 0) {
        return this.throw('No academic standards are associated with spark point id: ' + sparkpointId, 404);
    }

    result = yield this.pgp.one(
        //language=SQL
        `
        WITH fusebox_questions AS (
          SELECT id,
                 'fusebox'::text AS source,
                 question,
                 gradelevel AS "gradeLevel"
            FROM fusebox_guiding_questions
           WHERE standardids ?| $1
        ),

        questions AS (
            SELECT *, 1 AS RN
              FROM fusebox_questions

            UNION ALL

            SELECT id,
                   source::text,
                   question,
                   NULL as "gradeLevel",
                   2 AS RN
              FROM conference_questions
             WHERE student_id = $2
               AND sparkpoint_id = $3
          ORDER BY RN, id ASC
        ),

        resources AS (
          SELECT id,
                 title,
                 url,
                 gradelevel AS "gradeLevel"
            FROM fusebox_conference_resources
           WHERE standardids ?| $1
        )

        SELECT json_build_object(
            'questions',
            (
               SELECT json_agg(row_to_json(questions))
                 FROM questions
            ),

            'resources',
            (
              SELECT json_agg(row_to_json(resources))
                FROM resources
            ),

            'worksheet',
            (
                SELECT worksheet
                  FROM conference_worksheets
                 WHERE student_id = $2
                   AND sparkpoint_id = $3
           )
        ) AS json;
    `, [standardIds, userId, sparkpointId]);

    this.body = result.json;
}

module.exports = {
    get: getHandler
};
