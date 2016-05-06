'use strict';

var fusebox = require('../../lib/fusebox'),
    AsnStandard = require('../../lib/asn-standard');

function *getHandler() {
    var ctx = this,
        sparkpointId = ctx.query.sparkpoint_id,
        standardIds = [],
        assessments,
        reflection;

    ctx.assert(ctx.studentId, 'You must be logged in as a student, or pass a student_id to perform this action.', 400);
    ctx.assert(sparkpointId, 'sparkpoint, sparkpoint_id, or sparkpoint_code are required.', 400);

    (ctx.lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function (asnId) {
        standardIds = standardIds.concat(new AsnStandard(asnId).asnIds);
    });

    ctx.assert(standardIds.length > 0, `No academic standards are associated with sparkpoint id: ${sparkpointId}`, 404);

    assessments = yield ctx.pgp.manyOrNone(/*language=SQL*/ `
       SELECT title,
              url,
              vendorid,
              gradelevel,
              standards,
              standardids,
              v.name AS vendor
         FROM fusebox_assessments
         JOIN fusebox_vendors v
           ON v.id = fusebox_assessments.vendorid
        WHERE standardids ?| $1`,
        [standardIds]
    );

    reflection = yield ctx.pgp.oneOrNone(/*language=SQL*/ `
      SELECT reflection
        FROM assesses
       WHERE sparkpoint_id = $1
         AND student_id = $2;`,
        [sparkpointId, this.studentId]
    );

    ctx.body = {
        assessments: assessments.map(fusebox.normalizeAssessment),
        reflection: reflection ? reflection.reflection : ''
    };
}

function *patchHandler() {
    this.require(['sparkpoint_id', 'student_id', 'reflection']);

    var ctx = this,
        sparkpointId = ctx.query.sparkpoint_id,
        reflection = ctx.query.reflection;

    ctx.body = yield ctx.pgp.one(/*language=SQL*/ `
            INSERT INTO assesses
                 VALUES ($1, $2, $3) ON CONFLICT (student_id, sparkpoint_id) DO UPDATE
                    SET reflection = $3
              RETURNING *`,
        [ctx.studentId,  sparkpointId, reflection]
    );
}

module.exports = {
    get: getHandler,
    patch: patchHandler
};