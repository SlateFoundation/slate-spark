'use strict';

var AsnStandard = require('../../lib/asn-standard');

function* getHandler() {
    var ctx = this,
        sparkpointId = ctx.query.sparkpoint_id,
        standardIds = [],
        sectionId = ctx.query.section_id,
        result,
        applies;

    ctx.require(['sparkpoint_id', 'section_id']);

    (ctx.lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function(asnId) {
        standardIds = standardIds.concat(new AsnStandard(asnId).asnIds);
    });

    ctx.assert(standardIds.length > 0, `No academic standards are associated with sparkpoint: ${sparkpointId}`, 404);
    ctx.assert(ctx.isTeacher, 'Only teachers can assign applies', 403);



    result = yield this.pgp.one(/*language=SQL*/ `
        WITH applies AS (
            SELECT *
              FROM fusebox_apply_projects
             WHERE standardids ?| $1
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
                   AND resource_id = ANY(SELECT id FROM applies)
             ) t GROUP BY resource_id
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
                'sparkpointIds',
                (SELECT json_agg(id)
                 FROM sparkpoints
                WHERE metadata->>'asn_id' = ANY($1)
                ),
                'sparkpointCodes',
                (SELECT json_agg(code)
                 FROM sparkpoints
                WHERE metadata->>'asn_id' = ANY($1)
                ),
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
                )
            )) FROM applies ap
            ), '[]'::JSON)
        ) AS json;
    `, [standardIds, sparkpointId, sectionId]);

    ctx.body = result.json;
}

module.exports = {
    get: getHandler
};

