'use strict';

var util = require('./../lib/util'),
    Promise = require('bluebird'),
    db = require('./../lib/database')(),
    lookup = {
        sparkpoint: {
            codeToId: {},
            idToCode: {},
            idToAsnIds: {}
        },

        standard: {
            codeToId: {},
            idToCode: {},
            idToAsnIds: {},
            idToSparkpointId: {}
        },

        vendor: {
            asnIdToVendorIdentifier: {},
            asnIdToVendorCode: {},
            vendorCodeToAsnId: {},
            vendorIdentifierToAsnId: {},
            nameToId: {},
            idToName: {}
        },
    },
    fs = require('fs'),
    cachePath = require('path').dirname(require.main.filename) + '/cache/lookup.json';

try {
    let cachedLookup = require(cachePath);
    lookup = cachedLookup;
} catch (e) {
    Promise.all([
        db.many(`
    SELECT id,
           code,
           array_prepend(metadata->>'asn_id', get_descendant_asn_ids(metadata->>'asn_id')::text[]) AS asn_ids
      FROM sparkpoints`),
        db.many(`
    SELECT asn_id,
           children_ids,
           code
      FROM standards;
    `),
        db.many(`
    SELECT asn_id,
           code
      FROM standards
     WHERE code IN (
             SELECT code
                 FROM standards
         GROUP BY code
             HAVING (COUNT(code) = 1)
     );
    `),
        db.many(`
    SELECT * FROM vendor_standards_crosswalk;
    `),
        db.many(`
        SELECT id,
           name
      FROM vendors
     WHERE id = ANY(
       SELECT DISTINCT(vendor_id)
         FROM vendor_standards_crosswalk
     );
    `)]).then(function (result) {

        var sparkpoints = result[0],
            standards = result[1],
            uniqueStandardCodes = result[2],
            vendorCrosswalk = result[3],
            vendors = result[4];

        sparkpoints.forEach(function (sparkpoint) {
            if (typeof sparkpoint.code === 'string') {
                lookup.sparkpoint.codeToId[sparkpoint.code.toLowerCase()] = sparkpoint.id;
            }
            lookup.sparkpoint.idToCode[sparkpoint.id] = sparkpoint.code;
            lookup.sparkpoint.idToAsnIds[sparkpoint.id] = sparkpoint.asn_ids;

            sparkpoint.asn_ids.forEach(function (asnId) {
                lookup.standard.idToSparkpointId[asnId] = sparkpoint.id;
            });
        });

        uniqueStandardCodes.forEach(function (standard) {
            lookup.standard.codeToId[standard.code.toLowerCase()] = standard.asn_id;
        });

        standards.forEach(function (standard) {
            lookup.standard.idToCode[standard.asn_id] = standard.code;
            lookup.standard.idToAsnIds[standard.asn_id] = [].concat(standard.asn_id, standard.children_ids);
        });

        vendorCrosswalk.forEach(function (crosswalk) {
            lookup.vendor.asnIdToVendorIdentifier[crosswalk.vendor_id] = lookup.vendor.asnIdToVendorIdentifier[crosswalk.vendor_id] || {};
            lookup.vendor.asnIdToVendorIdentifier[crosswalk.vendor_id][crosswalk.asn_id] = crosswalk.vendor_identifier;

            lookup.vendor.asnIdToVendorCode[crosswalk.vendor_id] = lookup.vendor.asnIdToVendorCode[crosswalk.vendor_id] || {};
            lookup.vendor.asnIdToVendorCode[crosswalk.vendor_id][crosswalk.asn_id] = crosswalk.vendor_code;

            lookup.vendor.vendorCodeToAsnId[crosswalk.vendor_id] = lookup.vendor.vendorCodeToAsnId[crosswalk.vendor_id] || {};
            if (typeof crosswalk.vendor_code === 'string') {
                lookup.vendor.vendorCodeToAsnId[crosswalk.vendor_id][crosswalk.vendor_code.toLowerCase()] = crosswalk.asn_id;
            }

            lookup.vendor.vendorIdentifierToAsnId[crosswalk.vendor_id] = lookup.vendor.vendorIdentifierToAsnId[crosswalk.vendor_id] || {};
            lookup.vendor.vendorIdentifierToAsnId[crosswalk.vendor_id][crosswalk.vendor_identifier] = crosswalk.asn_id;
        });

        vendors.forEach(function (vendor) {
            lookup.vendor.nameToId[vendor.name.toString().toLowerCase()] = vendor.id;
            lookup.vendor.idToName[vendor.id] = vendor.name;
        });

        fs.writeFileSync(cachePath, JSON.stringify(lookup, null, '\t'));
        console.log(cachePath);

    }, function(error) {
        throw error;
    });
}

module.exports = lookup;