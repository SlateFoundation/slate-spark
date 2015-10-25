var AsnStandard = require('../lib/asn-standard'),
    lookup = require('../lib/lookup');

function standardsHandler(req, res, next) {
    if (req.params.id) {
        res.json(new AsnStandard(req.params.id));
    } else {
        res.json(Object.keys(lookup.standard.idToCode).map(id => new AsnStandard(id)));
    }

    next();
}

module.exports = standardsHandler;
