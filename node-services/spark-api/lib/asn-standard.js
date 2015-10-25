var util = require('./util'),
    lookup = require('./lookup');

function AsnStandard(standard) {
    var self = this,
        asnIds,
        vendorName,
        vendorId;

    this.sparkpoints = [];
    this.codes = [];
    this.vendorCodes = {};
    this.vendorIdentifiers = {};

    if (util.isAsnId(standard)) {
        asnIds = lookup.standard.idToAsnIds[standard];
    } else {
        asnIds = lookup.standard.idToAsnIds[lookup.standard.codeToId[standard.toString().toLowerCase()]];
    }

    if (Array.isArray(asnIds)) {
        this.asnIds = asnIds;

        asnIds.forEach(function (asnId) {
            var sparkPointId = lookup.standard.idToSparkpointId[asnId],
                code = lookup.standard.idToCode[asnId];

            if (sparkPointId) {
                self.sparkpoints.push(sparkPointId);
            }

            if (code) {
                self.codes.push(code);
            }
        });
    }

    for (vendorName in lookup.vendor.nameToId) {
        vendorId = lookup.vendor.nameToId[vendorName];
        vendorName = lookup.vendor.idToName[vendorId];
        this.vendorCodes[vendorName] = this.toVendorCodes(vendorId);
        this.vendorIdentifiers[vendorName] = this.toVendorIdentifiers(vendorId);
    }

    this.sparkpoint = this.sparkpoints[0];
    this.code = this.codes[0];
}

AsnStandard.prototype.toVendorCodes = function toVendorCodes(vendor) {
    var vendorId = (typeof vendor === 'string') ? lookup.vendor.nameToId[vendor] : vendor,
        vendorCodes = [];

    this.asnIds.forEach(function (asnId) {
        var vendorCode = lookup.vendor.asnIdToVendorCode[vendorId][asnId];

        if (vendorCode) {
            vendorCodes.push(vendorCode);
        }
    });

    return vendorCodes;
};

AsnStandard.prototype.toVendorIdentifiers = function toVendorIdentifiers(vendor) {
    var vendorId = (typeof vendor === 'string') ? lookup.vendor.nameToId[vendor] : vendor,
        vendorIdentifiers = [];

    this.asnIds.forEach(function (asnId) {
        var vendorIdentifier = lookup.vendor.asnIdToVendorIdentifier[vendorId][asnId];

        if (vendorIdentifier) {
            vendorIdentifiers.push(vendorIdentifier);
        }
    });

    return vendorIdentifiers;
};

module.exports = AsnStandard;