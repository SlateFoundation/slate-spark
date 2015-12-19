var AsnStandard = require('../../lib/asn-standard'),
    lookup = require('../../lib/lookup'),
    db = require('../../middleware/database'),
    JsonApiError = require('../../lib/error').JsonApiError,
    Promise = require('bluebird'),
    util = require('../../lib/util'),
    fusebox = require('../../lib/fusebox');

function *assessmentsHandler() {
    this.require(['sparkpoint_id']);

    var sparkpointId = this.query.sparkpoint_id,
        standardIds = [],
        assessments;

    (lookup.entities.sparkpoint.idToAsnIds[sparkpointId] || []).forEach(function(asnId) {
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
