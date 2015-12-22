var AsnStandard;

function *assessmentsHandler() {
    this.require(['sparkpoint_id']);

    var sparkpointId = this.query.sparkpoint_id,
        standardIds = [],
        assessments;

    // TODO: There should be a better way to share the app context between modules
    AsnStandard || (AsnStandard = require('../../lib/asn-standard')(this.app));

    (this.lookup.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function(asnId) {
        standardIds = standardIds.concat(new AsnStandard(asnId).asnIds);
    });

    if (standardIds.length === 0) {
        this.throw('No academic standards are associated with sparkpoint id: ' + sparkpointId, 404);
    }

    assessments = yield this.pgp.any(
        `SELECT title,
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

    this.body = assessments.map(fusebox.normalizeAssessment);
}

module.exports = assessmentsHandler;
