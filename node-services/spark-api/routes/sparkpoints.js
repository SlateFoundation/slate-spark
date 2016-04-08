'use strict';

var suggestionCache = {};

function* autocompleteGetHandler(input) {
    var ctx = this,
        result,
        patternSafeInput;

    input = (typeof input === 'string') ? input : ctx.query.q;

    if (typeof input !== 'string') {
        return ctx.body = [];
    }

    patternSafeInput = input
        .replace(/[\[|\]|\|\^|\$|\%|\(|\)|\?|\+|\{|\}|\=|\\]/g, '')
        /* Escape characters that appear in sparkpoint codes */
        .replace('*', '\\*')
        .replace(/\./g, '\\.')
        .replace(/\-/g, '\\-');

    // TODO: invalidate cache when sparkpoints and standards tables change
    result = suggestionCache[input];

    if (!result) {
        result = suggestionCache[input] = yield ctx.pgp.manyOrNone(`
        WITH standards_fts AS (
            SELECT sparkpoints.id,
                   sparkpoints.code,
                   sparkpoints.student_title,
                   ts_rank_cd (t1.tsv, plainto_tsquery(lower($1))) AS match
              FROM (
                SELECT asn_id, tsv
                FROM standards, plainto_tsquery(lower($1)) AS q
                WHERE (tsv @@ q)
              ) AS t1
              JOIN sparkpoints ON t1.asn_id = sparkpoints.metadata->>'asn_id'
          ORDER BY ts_rank_cd (t1.tsv, plainto_tsquery(lower($1))) DESC LIMIT 10),
          sparkpoints_fts AS (
              SELECT sp.id,
                     sp.code,
                     sp.student_title,
                     ts_rank_cd (sp.tsv, plainto_tsquery(lower($1))) AS match
                FROM (
                  SELECT id, code, student_title, tsv
                  FROM sparkpoints, plainto_tsquery(lower($1)) AS q
                  WHERE (tsv @@ q)
                ) AS sp
           ORDER BY ts_rank_cd (sp.tsv, plainto_tsquery(lower($1))) DESC LIMIT 10),
          sparkpoints_code AS (
              SELECT sp.id,
                     sp.code,
                     sp.student_title,
                     similarity(code, $1) AS match
                FROM sparkpoints sp
              WHERE code ~* $2
            LIMIT 10),
          standards_code AS (
              SELECT sp.id,
                     sp.code,
                     sp.student_title,
                     similarity(standards.code, $1) AS match
                FROM standards
                JOIN sparkpoints sp ON standards.asn_id = sp.metadata->>'asn_id'
              WHERE standards.code ~* $2
            LIMIT 10)

        SELECT id, code, student_title FROM (
          (SELECT * FROM standards_fts)
          UNION DISTINCT
          (SELECT * FROM sparkpoints_fts)
          UNION DISTINCT
          (SELECT * FROM sparkpoints_code)
          UNION DISTINCT
          (SELECT * FROM standards_code)
          ORDER BY match DESC
          LIMIT 10
        ) results;`,
            [ input, patternSafeInput ]
        );
    }

    ctx.body = result;
}

function* suggestedGetHandler() {
    this.require(['section_id']);

    var ctx = this,
        currentLimit = parseInt(ctx.query.current, 10) || 5,
        queuedLimit = parseInt(ctx.query.queued, 10) || 5,
        pastLimit = parseInt(ctx.query.past, 10) || 5,
        studentId = ctx.isStudent ? ctx.studentId : ~~ctx.query.student_id,
        sectionId = ~~ctx.query.section_id,
        results;

    ctx.assert(sectionId > 0, 'section_id is required', 400);
    ctx.assert(studentId > 0, 'Non-student users must provide a student_id', 400);

    yield ctx.pgp.one(`
    WITH past AS (
            SELECT sp.code,
                   ss.sparkpoint_id AS id,
                   ss.student_id,
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
                   ss.assess_finish_time,
                   ss.conference_group_id,
                   ss.selected_apply_id,
                   ss.selected_fb_apply_id,
                   ssas.last_accessed,
                   ssas.section_id,
                   ssas.recommender_id,
                   ssas.recommended_time,
                   sp.student_title
              FROM section_student_active_sparkpoint ssas
         LEFT JOIN student_sparkpoint ss ON ss.sparkpoint_id = ssas.sparkpoint_id
               AND ss.student_id = $1
              JOIN sparkpoints sp ON sp.id = ssas.sparkpoint_id
             WHERE ssas.section_id = $2
               AND ss.apply_finish_time IS NOT NULL
               AND ssas.student_id = $1
          ORDER BY ssas.last_accessed DESC
             LIMIT $3
         ),

         current AS (
            SELECT sp.code,
                   ss.sparkpoint_id AS id,
                   ss.student_id,
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
                   ss.assess_finish_time,
                   ss.conference_group_id,
                   ss.selected_apply_id,
                   ss.selected_fb_apply_id,
                   ssas.last_accessed,
                   ssas.section_id,
                   ssas.recommender_id,
                   ssas.recommended_time,
                   sp.student_title
              FROM section_student_active_sparkpoint ssas
        RIGHT JOIN student_sparkpoint ss ON ss.sparkpoint_id = ssas.sparkpoint_id
               AND ss.student_id = $1
              JOIN sparkpoints sp ON sp.id = ssas.sparkpoint_id
             WHERE ssas.section_id = $2
               AND ssas.student_id = $1
               AND ss.apply_finish_time IS NULL
          ORDER BY ssas.last_accessed DESC
             LIMIT $4
         ),

        queued AS (
            SELECT sp.code,
                   ss.sparkpoint_id AS id,
                   ss.student_id,
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
                   ss.assess_finish_time,
                   ss.conference_group_id,
                   ss.selected_apply_id,
                   ss.selected_fb_apply_id,
                   ssas.last_accessed,
                   ssas.section_id,
                   ssas.recommender_id,
                   ssas.recommended_time,
                   sp.student_title
              FROM section_student_active_sparkpoint ssas
         LEFT JOIN student_sparkpoint ss ON ss.sparkpoint_id = ssas.sparkpoint_id
               AND ss.student_id = $1
              JOIN sparkpoints sp ON sp.id = ssas.sparkpoint_id
             WHERE ssas.section_id = $2
               AND ssas.student_id = $1
               AND ss.learn_start_time IS NULL
          ORDER BY ssas.recommended_time DESC, ssas.last_accessed DESC
           LIMIT $5
       )

       SELECT json_agg(j) AS sparkpoints FROM (
            SELECT row_to_json(past) j FROM past
            UNION ALL
            SELECT row_to_json(current) j FROM current
            UNION ALL
            SELECT row_to_json(queued) j FROM queued
        ) t;`, [ studentId, sectionId, pastLimit, currentLimit, queuedLimit ]);

    ctx.body = results.sparkpoints;
}

function bustSuggestionCache() {
    console.log('Busting spark point suggestion cache...');

    for (var prop in suggestionCache) {
        delete suggestionCache[prop];
    }
}

module.exports = {
    autocomplete: {
        get: autocompleteGetHandler
    },
    suggested: {
        get: suggestedGetHandler
    },
    suggestionCache: suggestionCache,
    bustSuggestionCache: bustSuggestionCache
};
