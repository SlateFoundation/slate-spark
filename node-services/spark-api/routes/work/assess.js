'use strict';

var AsnStandard = require('../../lib/asn-standard'),
    lookup = require('../../lib/lookup'),
    fusebox = require('../../lib/fusebox');

function *getHandler() {
    this.require(['sparkpoint_id', 'student_id']);

    var sparkpointId = this.query.sparkpoint_id,
        standardIds = [],
        assessments,
        reflection;

    (lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function (asnId) {
        standardIds = standardIds.concat(new AsnStandard(asnId).asnIds);
    });

    if (standardIds.length === 0) {
        return this.throw('No academic standards are associated with spark point id: ' + sparkpointId, 404);
    }

    assessments = yield this.pgp.manyOrNone(`SELECT title,
                          url,
                          vendorid,
                          gradelevel,
                          standards,
                          standardids,
                          v.name AS vendor
                     FROM fusebox_assessments
                     JOIN fusebox_vendors v
                       ON v.id = fusebox_assessments.vendorid
                    WHERE standardids ?| $1`, [standardIds]);

    reflection = yield this.pgp.oneOrNone(
        `SELECT reflection FROM assesses WHERE sparkpoint_id = $1 and student_id = $2`,
        [sparkpointId, this.studentId]
    );

    this.body = {
        assessments: assessments.map(fusebox.normalizeAssessment),
        reflection: reflection ? reflection.reflection : ''
    };
}

function *patchHandler() {
    this.require(['sparkpoint_id', 'student_id', 'reflection']);

    var sparkpointId = this.query.sparkpoint_id,
        reflection = this.query.reflection;

    this.body = yield this.pgp.one(`
            INSERT INTO assesses
                 VALUES ($1, $2, $3) ON CONFLICT (student_id, sparkpoint_id) DO UPDATE
                    SET reflection = $3
              RETURNING *`,
        [this.studentId,  sparkpointId, reflection]
    );
}

module.exports = {
    get: getHandler,
    patch: patchHandler
};