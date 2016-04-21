var AsnStandard = require('../../lib/asn-standard'),
    fusebox = require('../../lib/fusebox');

function *assessmentsHandler() {
    this.require(['sparkpoint_id', 'section_id']);

    var sparkpointId = this.query.sparkpoint_id,
        standardIds = [],
        assessments;

    (this.lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function(asnId) {
        standardIds = standardIds.concat(new AsnStandard(asnId).asnIds);
    });



    if (standardIds.length === 0) {
        this.throw('No academic standards are associated with sparkpoint id: ' + sparkpointId, 404);
    }

    assessments = yield this.pgp.any(/*language=SQL*/ `
        WITH assessments AS (
            SELECT fusebox_assessments.id AS id,
                   title,
                   url,
                   vendorid,
                   gradelevel,
                   standards,
                   standardids,
                   v.name AS vendor
              FROM fusebox_assessments
              JOIN fusebox_vendors v
                ON v.id = fusebox_assessments.vendorid
             WHERE standardids ?| $1
        ), assignments AS (
          SELECT resource_id, json_object_agg((CASE WHEN student_id IS NULL THEN 'section' ELSE 'student' END), assignment) AS assignment
            FROM assessment_assignments
           WHERE sparkpoint_id = 'M10001B3'
             AND section_id = $
             AND resource_id = ANY(SELECT id FROM fusebox_assessments)
             AND (student_id = 7 OR student_id IS NULL)
          GROUP BY resource_id
        )

        SELECT assessments.*,
               assignments.*
          FROM assessments
          JOIN assignments
            ON assignments.resource_id = assessments.id;
        `, [standardIds, this.query.section_id,]);

    this.body = assessments.map(fusebox.normalizeAssessment);
}

module.exports = assessmentsHandler;
