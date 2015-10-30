var AsnStandard = require('../lib/asn-standard'),
    lookup = require('../lib/lookup');

module.exports = {
    get: function *standardsHandler(standardId) {

        standardId || (standardId = this.query.id);

        if (standardId) {
            this.body = new AsnStandard(standardId);
        } else {
            this.throw(404);
        }
    },

    list: function *standardsHandler() {
        this.body = standardsHandler.cache || (standardsHandler.cache = Object.keys(lookup.standard.idToCode).map(id => new AsnStandard(id)));
    }
};