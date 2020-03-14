'use strict';

function* getHandler() {
    var ctx = this,
        sparkpointIds = (ctx.query.sparkpoint_ids || '').split(','),
        standardSparkpointIds = sparkpointIds.filter(id => id.startsWith('M')) || [],
        lessonSparkpointIds = sparkpointIds.filter(id => id.startsWith('L')) || [];

        ctx.assert(sparkpointIds.length > 0, 'sparkpoint_ids must be comma delimited list of one or more sparkpoint_ids');

        ctx.body = (yield ctx.pgp.any(/* language=SQL */ `
            WITH asn_ids AS (
              SELECT array_agg(asn_id)::char(8)[] || $2::char(8)[] AS asn_ids
                FROM public.sparkpoint_standard_alignments
               WHERE sparkpoint_id = ANY($1::char(8)[])
            ),
            sparkpoint_standards AS (
              SELECT sparkpoint_id,
                     array_agg(asn_id) AS asn_ids
                FROM public.sparkpoint_standard_alignments
               WHERE sparkpoint_id = ANY($1::char(8)[])
               GROUP BY sparkpoint_id
            ),
            learns AS (
              SELECT *,
                     'learn' AS type
                FROM slate1.fusebox_learn_links
               WHERE standardids ?| (SELECT asn_ids FROM asn_ids LIMIT 1)
            ), applies AS (
              SELECT *,
                     'apply' AS type
                FROM slate1.fusebox_apply_projects
               WHERE standardids ?| (SELECT asn_ids FROM asn_ids LIMIT 1)
            ), conference_resources AS (
              SELECT *,
                     'conference_resource' AS type
                FROM slate1.fusebox_conference_resources
               WHERE standardids ?| (SELECT asn_ids FROM asn_ids LIMIT 1)
            ), guiding_questions AS (
              SELECT *,
                     'guiding_question' AS type
                FROM slate1.fusebox_guiding_questions
               WHERE standardids ?| (SELECT asn_ids FROM asn_ids LIMIT 1)
            ), assessments AS (
              SELECT *,
                     'assessment' AS type
                FROM slate1.fusebox_assessments
               WHERE standardids ?| (SELECT asn_ids FROM asn_ids LIMIT 1)
            )
            
            SELECT row_to_json(learns) AS resource FROM learns
            UNION ALL
            SELECT row_to_json(applies) AS resource FROM applies
            UNION ALL
            SELECT row_to_json(conference_resources) AS resource FROM conference_resources
            UNION ALL
            SELECT row_to_json(guiding_questions) AS resource FROM guiding_questions
            UNION ALL
            SELECT row_to_json(assessments) AS resource FROM assessments
        `, [standardSparkpointIds, lessonSparkpointIds]))
        .map(function(resource) {
            resource = resource.resource;
            resource.fusebox_id = resource.id;

            delete resource.id;

            if (resource.metadata) {
                try {
                    resource.metadata = JSON.parse(resource.metadata);
                } catch (e) {
                    resource.metadata = null;
                }
            }

            resource.sparkpoint_ids = (resource.standardids || [])
                .map(id => ctx.lookup.standard.idToSparkpointId[id])
                .filter(val => val);

            resource.sparkpoints = (resource.sparkpoint_ids || [])
                .map(id => ctx.lookup.sparkpoint.cache.idToCode[id])
                .filter(val => val);

            return resource;
       });
}

module.exports = {
    get: getHandler
};