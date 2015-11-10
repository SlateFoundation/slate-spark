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

module.exports = {
    autocomplete: {
        get: autocompleteGetHandler
    }
};
