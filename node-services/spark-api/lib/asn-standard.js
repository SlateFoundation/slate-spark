module.exports = function (app) {
    var util = require('./util'),
        lookup = app.context.lookup;

    function AsnStandard(standard) {
        var self = this,
            asnIds,
            vendorName,
            vendorId,
            standardId;

        this.sparkpoints = [];
        this.codes = [];
        this.vendorCodes = {};
        this.vendorIdentifiers = {};

        standardId = util.isAsnId(standard) ? standard : lookup.shared.standard.cache.codeToId[standard];

        if (standardId) {
            asnIds = lookup.shared.standard.idToAsnIds[standard];
        } else {
            throw new Error(`Invalid standard passed to AsnStandard constructor: ${standard}`);
        }

        if (Array.isArray(asnIds)) {
            this.asnIds = asnIds;

            asnIds.forEach(function (asnId) {
                var sparkPointId = lookup.shared.standard.idToSparkpointId[asnId],
                    code = lookup.shared.standard.idToCode[asnId];

                if (sparkPointId) {
                    self.sparkpoints.push(sparkPointId);
                }

                if (code) {
                    self.codes.push(code);
                }
            });
        }

        for (vendorName in lookup.shared.vendor.nameToId) {
            vendorId = lookup.shared.vendor.nameToId[vendorName];
            vendorName = lookup.shared.vendor.idToName[vendorId];
            this.vendorCodes[vendorName] = this.toVendorCodes(vendorId);
            this.vendorIdentifiers[vendorName] = this.toVendorIdentifiers(vendorId);
        }

        this.sparkpoint = this.sparkpoints[0];
        this.code = this.codes[0];
    }

    AsnStandard.prototype.toVendorCodes = function toVendorCodes(vendor) {
        var vendorId = (typeof vendor === 'string') ? lookup.shared.vendor.nameToId[vendor] : vendor,
            vendorCodes = [];

        this.asnIds.forEach(function (asnId) {
            var vendorCode = lookup.shared.vendor.asnIdToVendorCode[vendorId][asnId];

            if (vendorCode) {
                vendorCodes.push(vendorCode);
            }
        });

        return vendorCodes;
    };

    AsnStandard.prototype.toVendorIdentifiers = function toVendorIdentifiers(vendor) {
        var vendorId = (typeof vendor === 'string') ? lookup.shared.vendor.nameToId[vendor] : vendor,
            vendorIdentifiers = [];

        this.asnIds.forEach(function (asnId) {
            var vendorIdentifier = lookup.shared.vendor.asnIdToVendorIdentifier[vendorId][asnId];

            if (vendorIdentifier) {
                vendorIdentifiers.push(vendorIdentifier);
            }
        });

        return vendorIdentifiers;
    };

    return AsnStandard;
};