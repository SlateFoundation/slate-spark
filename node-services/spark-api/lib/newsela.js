var client = restify.createJsonClient({
        url: 'https://newsela.com/api/v0'
    });

function getResources(readingStandards, cb) {
    var qs = '';

    readingStandards = (readingStandards || []).map(function (standard) {
        return 'reading_standards=' + ('' + standard).split('.').pop();
    });

    if (readingStandards.length > 0) {
        qs = '?' + readingStandards.join('&');
    }

    client.get('/articleheader' + qs, function(err, req, res, obj) {
        console.log('articleheader' + qs);
        console.log(obj.length);
        cb(err, obj);
    });
}

module.exports = {
  getResources: getResources
};