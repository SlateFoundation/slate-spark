'use strict';

var suggestionCache = {};

function* autocompleteGetHandler(input) {
    var result;

    input = (typeof input === 'string') ? input : this.query.q;

    if (typeof input !== 'string') {
        return this.body = [];
    }

    // TODO: invalidate cache when sparkpoints and standards tables change
    result = suggestionCache[input];

    if (!result) {
        result = suggestionCache[input] = yield this.pgp.manyOrNone(`
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
              WHERE code ~* $1
            LIMIT 10),
          standards_code AS (
              SELECT sp.id,
                     sp.code,
                     sp.student_title,
                     similarity(standards.code, $1) AS match
                FROM standards
                JOIN sparkpoints sp ON standards.asn_id = sp.metadata->>'asn_id'
              WHERE standards.code ~* $1
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
            [input]
        );
    }

    this.body = result;
}

function* suggestedGetHandler() {
   this.require(['student_id', 'section_id']);

    var currentLimit = parseInt(this.query.current, 10) || 5,
        queuedLimit = parseInt(this.query.queued, 10) || 5,
        pastLimit = parseInt(this.query.past, 10) || 5,
        studentId = this.query.student_id,
        sectionId = this.query.section_id,
        results = yield this.pgp.one(`
   WITH past AS (
            SELECT code AS sparkpoint,
                   ss.*,
                   last_accessed,
                   section_id,
                   student_title
              FROM section_student_active_sparkpoint ssas
         LEFT JOIN student_sparkpoint ss ON ss.sparkpoint_id = ssas.sparkpoint_id
               AND ss.student_id = $1
              JOIN sparkpoints ON sparkpoints.id = ssas.sparkpoint_id
             WHERE ssas.section_id = $2
               AND ss.apply_finish_time IS NOT NULL
               AND ssas.student_id = $1
          ORDER BY ssas.id
             LIMIT $3
         ),

         current AS (
            SELECT code AS sparkpoint,
                   ss.*,
                   last_accessed,
                   section_id,
                   student_title
              FROM section_student_active_sparkpoint ssas
        RIGHT JOIN student_sparkpoint ss ON ss.sparkpoint_id = ssas.sparkpoint_id
               AND ss.student_id = $1
              JOIN sparkpoints ON sparkpoints.id = ssas.sparkpoint_id
             WHERE ssas.section_id = $2
               AND ssas.last_accessed IS NOT NULL
               AND ssas.student_id = $1
               AND ss.apply_finish_time IS NULL
          ORDER BY ssas.id
             LIMIT $4
         ),

        queued AS (
            SELECT ssas.*,
                   student_title,
                   code AS sparkpoint
              FROM section_student_active_sparkpoint ssas
              JOIN sparkpoints ON sparkpoints.id = ssas.sparkpoint_id
             WHERE last_accessed IS NULL
               AND section_id = $2
               AND ssas.student_id = $1
          ORDER BY ssas.id
           LIMIT $5
       )

       SELECT json_agg(j) AS sparkpoints FROM (
            SELECT row_to_json(past) j FROM past
            UNION ALL
            SELECT row_to_json(current) j FROM current
            UNION ALL
            SELECT row_to_json(queued) j FROM queued
        ) t;`, [ studentId, sectionId, pastLimit, currentLimit, queuedLimit ]);

    this.body = results.sparkpoints;
}

module.exports = {
    autocomplete: {
        get: autocompleteGetHandler
    },
    suggested: {
        get: suggestedGetHandler
    }
};
