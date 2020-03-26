'use strict';

const util = require('../../lib/util');
const AsnStandard = require('../../lib/asn-standard');
const recordToModel = require('../work/lessons/index.js').recordToModel;

async function getHandler(ctx, next) {
    var sparkpointId = ctx.query.sparkpoint_id,
        standardIds = [],
        sectionId = ~~ctx.query.section_id,
        isLesson = util.isLessonSparkpoint(sparkpointId),
        sparkpointIds = !isLesson ? [sparkpointId] : [],
        resources,
        lesson;

    ctx.require(['sparkpoint_id', 'section_id']);

    if (isLesson) {
        try {
            lesson = recordToModel(await ctx.pgp.one('SELECT * FROM lessons WHERE sparkpoint_id = $1', [sparkpointId]));
            sparkpointIds = lesson.sparkpoints.map(sparkpoint => sparkpoint.id).concat(sparkpointId);
            standardIds.push(sparkpointId);
        } catch (e) {
            return ctx.throw(404, e);
        }
    }

    sparkpointIds.forEach(function(sparkpointId) {
        (ctx.lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function (asnId) {
            standardIds = standardIds.concat(new AsnStandard(asnId).asnIds);
        });
    });

    ctx.assert(ctx.isTeacher, 'Only teachers can assign conference resources', 403);

    resources = (await ctx.pgp.one(/*language=SQL*/ `
        WITH resources AS (
            SELECT id AS resource_id,
                   '' AS creator,
                   created,
                   title,
                   url,
                   gradelevel AS "gradeLevel"
              FROM fusebox_conference_resources
             WHERE standardids ?| $1::char(8)[]
        ),
        
        resource_assignments AS (
            SELECT resource_id,
                json_object_agg(
                   CASE WHEN student_id IS NULL
                        THEN 'section'
                        ELSE student_id::TEXT
                   END,
                   assignment
                ) AS assignment
            FROM (
                 SELECT resource_id,
                        assignment,
                        student_id
                  FROM conference_resource_assignments
                 WHERE sparkpoint_id = $2
                   AND section_id = $3
                   AND resource_id = ANY(SELECT resource_id FROM resources)
             ) t GROUP BY resource_id
        )
          
        SELECT json_build_object(
            'conference_resources',
            (
              SELECT json_agg(row_to_json(t)) FROM (
                SELECT
                  resources.*,
                  COALESCE(resource_assignments.assignment, '{}'::JSON) AS assignments
                FROM resources
                  LEFT JOIN resource_assignments ON resource_assignments.resource_id = resources.resource_id
              ) t
            )
        ) AS json;
    `, [standardIds, sparkpointId, sectionId])).json;

    resources.lesson = lesson || null;
    ctx.body = resources;
}

module.exports = {
    get: getHandler
};

