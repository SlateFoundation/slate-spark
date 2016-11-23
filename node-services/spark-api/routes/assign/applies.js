'use strict';

const util = require('../../lib/util');
const AsnStandard = require('../../lib/asn-standard');
const recordToModel = require('../work/modules/index.js').recordToModel;

function* getHandler() {

    var ctx = this,
        sparkpointId = ctx.query.sparkpoint_id,
        standardIds = [],
        sectionId = ~~ctx.query.section_id,
        isLesson = util.isLessonSparkpoint(sparkpointId),
        sparkpointIds = !isLesson ? [sparkpointId] : [],
        applies,
        lesson;

    ctx.require(['sparkpoint_id', 'section_id']);

    if (isLesson) {
        try {
            lesson = recordToModel(yield ctx.pgp.one('SELECT * FROM modules WHERE sparkpoint_id = $1', [sparkpointId]));
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

    ctx.assert(ctx.isTeacher, 'Only teachers can assign applies', 403);

    applies = (yield this.pgp.one(/*language=SQL*/ `
        WITH fusebox_applies AS (
            SELECT *
              FROM fusebox_apply_projects
             WHERE standardids ?| $1::char(8)[]
        ),
        
        apply_assignments AS (
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
                  FROM apply_assignments
                 WHERE sparkpoint_id = $2
                   AND section_id = $3
                   AND resource_id = ANY(SELECT id FROM fusebox_applies)
             ) t GROUP BY resource_id
        ),
        
        apply_activity AS (
            SELECT resource_id,
                   json_object_agg(
                       student_id,
                       CASE WHEN grade IS NOT NULL
                            THEN 'completed'
                            ELSE 'launched'
                       END
                   ) AS activity
              FROM applies
             WHERE student_id = ANY(SELECT "PersonID" FROM course_section_participants WHERE "CourseSectionID" = 4)
               AND resource_id = ANY(SELECT id FROM fusebox_applies)
               AND selected = TRUE
          GROUP BY resource_id
        )
        
        SELECT json_build_object(
            'applies',
            COALESCE((
              SELECT json_agg(json_build_object(
                'id',
                ap.id,
                'resource_id',
                ap.id, 
                'created',
                ap.created,
                'creator',
                '',
                'title',
                ap.title,
                'instructions',
                ap.instructions,
                'dok',
                ap.dok,
                'gradeLevel',
                ap.gradelevel,
                'timeEstimate',
                ap.timeestimate,
                'standardCodes',
                ap.standards,
                'todos',
                COALESCE((SELECT json_agg(json_build_object(
                    'todo',
                     todo,
                     'completed',
                     false
                )) AS todo
                FROM jsonb_array_elements(ap.todos) AS todo
                ), '[]'::JSON),
                'links',
                COALESCE((SELECT json_agg(
                  CASE WHEN jsonb_typeof(link) = 'string'
                       THEN jsonb_build_object('title', link, 'url', link)
                       ELSE link
                  END)
                 FROM jsonb_array_elements(ap.links) AS link
                ), '[]'::JSON),
                'metadata',
                CASE
                WHEN ap.metadata = '""'
                THEN '{}'::JSONB
                ELSE ap.metadata::JSONB
                END,
                'selected',
                false,
                'reflection',
                null,
                'submissions',
                '[]'::JSON,
                'comment',
                null,
                'rating',
                null,
                'grade',
                null,
                'graded_by',
                null,
                'assignments',
                COALESCE(
                    (SELECT assignment FROM apply_assignments WHERE resource_id = ap.id),
                    '{}':: JSON
                ),
                'activity',
                COALESCE(
                    (SELECT activity FROM apply_activity WHERE resource_id = ap.id),
                    '{}':: JSON
                )
            )) FROM fusebox_applies ap
            ), '[]'::JSON)
        ) AS json;
    `, [standardIds, sparkpointId, sectionId])).json;

    applies.lesson = lesson || null;
    ctx.body = applies;
}

module.exports = {
    get: getHandler
};

