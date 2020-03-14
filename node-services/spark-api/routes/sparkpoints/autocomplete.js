'use strict';

const _ = require('lodash');
var autocompleteCache = {};

function* getHandler() {
    var ctx = this,
        input = ctx.params.input,
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

    result = autocompleteCache[input];

    if (!result) {
        result = autocompleteCache[input] = yield ctx.pgp.manyOrNone(/*language=SQL*/ `
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
          ),
          standards_code AS (
              SELECT sp.id,
                     sp.code,
                     sp.student_title,
                     similarity(standards.code, $1) AS match
                FROM standards
                JOIN sparkpoints sp ON standards.asn_id = sp.metadata->>'asn_id'
              WHERE standards.code ~* $2
          )

        SELECT id, code, student_title FROM (
          (SELECT * FROM standards_fts)
          UNION DISTINCT
          (SELECT * FROM sparkpoints_fts)
          UNION DISTINCT
          (SELECT * FROM sparkpoints_code)
          UNION DISTINCT
          (SELECT * FROM standards_code)
        ) t
        ORDER BY (code = $1 OR id = $1) DESC, match DESC
        LIMIT 10;`,
            [ input, patternSafeInput ]
        );
    }

    ctx.body = _.uniqBy(result || [],(sparkpoint) => sparkpoint.id);
}

module.exports = {
    get: getHandler,
    // TODO: If we keep the in-process lookup/caching, listen for an event here instead of exposing a function
    bustCache: function() {
        console.log(`/sparkpoints/autocomplete: Purging ${Object.keys(autocompleteCache).length} cache entries.`);
        autocompleteCache = {};
    }
};
