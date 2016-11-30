'use strict';

const util = require('../../lib/util');
const AsnStandard = require('../../lib/asn-standard');
const recordToModel = require('../work/lessons/index.js').recordToModel;

function *getHandler(next) {
    var ctx = this,
        sparkpointId = ctx.query.sparkpoint_id,
        standardIds = [],
        sectionId = ~~ctx.query.section_id,
        isLesson = util.isLessonSparkpoint(sparkpointId),
        sparkpointIds = !isLesson ? [sparkpointId] : [],
        result, lesson, lessonLearnAssignmentsByFuseboxId = {};

    ctx.require(['sparkpoint_id', 'section_id']);

    if (isLesson) {
        try {
            lesson = recordToModel(yield ctx.pgp.one('SELECT * FROM lessons WHERE sparkpoint_id = $1', [sparkpointId]));
            sparkpointIds = lesson.sparkpoints.map(sparkpoint => sparkpoint.id).concat(sparkpointId);
            standardIds.push(sparkpointId);
        } catch (e) {
            return ctx.throw(404, new Error(`Unable to find lesson template for ${sparkpointId}`));
        }
    }

    sparkpointIds.forEach(function(sparkpointId) {
        (ctx.lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function (asnId) {
            standardIds = standardIds.concat(new AsnStandard(asnId).asnIds);
        });
    });

    ctx.assert(ctx.isTeacher, 'Only teachers can assign learns', 403);

    // HACK: call /work/learns to make sure that the playlist is cached/up to date
    ctx.query.student_id = ctx.userId;
    yield require('../work/learns').get.call(ctx, next);
    delete ctx.query.student_id;

    result = (yield ctx.pgp.one(/*language=SQL*/ `
        WITH playlist_cache AS (
            SELECT playlist
              FROM learn_playlist_cache
             WHERE sparkpoint_id = $1
               AND section_id = $2
          ORDER BY last_updated DESC
             LIMIT 1
        ), assignments AS (
            SELECT resource_id,
                   json_object_agg(
                       coalesce(student_id::TEXT, 'section'),
                       assignment
                   ) AS assignments
              FROM learn_assignments
             WHERE sparkpoint_id = $1
               AND section_id = $2
          GROUP BY resource_id
        ), learns_required AS (
            SELECT json_object_agg(
                      coalesce(student_id::text, 'section'),
                      required
                   ) AS learns_required
              FROM learns_required
             WHERE sparkpoint_id = $1
               AND section_id = $2
        ), learn_discussions AS (
          SELECT id,
                 body,
                 ts,
                 author_id,
                 resource_id
            FROM learn_discussions
           WHERE resource_id = ANY(
             SELECT (resource->>'resource_id')::INTEGER
               FROM (
                  SELECT jsonb_array_elements(playlist) AS resource
                    FROM playlist_cache
               ) unrolled_playlist
           )
           ORDER BY id
        ), learn_activity AS (
          SELECT resource_id,
                 json_object_agg(user_id, CASE WHEN completed = TRUE THEN 'completed' ELSE 'launched' END) AS users
            FROM learn_activity
           WHERE resource_id = ANY (
               SELECT jsonb_extract_path_text(jsonb_array_elements(playlist), 'resource_id')::INTEGER
                 FROM playlist_cache
               )
            GROUP BY resource_id
        )

        SELECT json_build_object(
            'learns',
            (SELECT playlist FROM playlist_cache),
            'assignments',
            coalesce((SELECT json_object_agg(resource_id, assignments) FROM assignments), '{}'::JSON),
            'learns_required',
            coalesce((SELECT learns_required FROM learns_required), '{}'::JSON),
            'discussions',
            coalesce((SELECT json_agg(learn_discussions) FROM learn_discussions), '{}'::JSON),
            'activity',
            coalesce((SELECT json_object_agg(resource_id, users) FROM learn_activity), '{}'::JSON)
        ) AS json;
    `, [sparkpointId, sectionId])).json;

    ctx.assert(
        Array.isArray(result.learns),
        404,
        `No playlist cache found for section_id: ${sectionId} sparkpoint_id: ${sparkpointId}`
    );

    result.learns.forEach(function(resource) {
        resource.assignments = result.assignments[resource.resource_id] || {};
        delete resource.assignment;

        // TODO: Once we fix the mismatch between fusebox_id and resource_id we need to merge in the lesson
        // assignments here

        // HACK: Learning targets are implicitly "required-first" unless they are otherwise assigned or part of a lesson
        if (!isLesson && resource.title.toLowerCase().indexOf('learning target') !== -1) {
            resource.assignments.section = resource.assignments.section || 'required-first';
        }

        if (isLesson) {
            let lessonResource = (lesson.learns || []).find(learn => learn.resource_id === resource.resource_id);

            if (lessonResource) {
                let {isRequired, isRecommended} = lessonResource;
                resource.assignments.lesson = isRequired ? 'required' : isRecommended ? 'recommended' : null;
                resource.lesson_group_id = lessonResource.lesson_group_id || null;
            }

            resource.assignments.lesson || (resource.assignments.lesson = null);
            resource.lesson_group_id || (resource.lesson_group_id = null);
        }

        resource.activity = result.activity[resource.resource_id] || {};
    });

    for (let resourceId in result.discussions) {
        let discussion = result.discussions[resourceId];
        util.namifyRecord(discussion, ctx.lookup);
    }

    result.learns_required.site = 5;

    delete result.assignments;
    delete result.activity;

    result.lesson = lesson || null;
    ctx.body = result;
}

module.exports = {
    get: getHandler
};
