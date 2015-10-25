var rnd = require('./util').rnd,
    db = require('./database')();

function normalizeFusebox(item) {
    return {
        completed: false,
        title: item.title,
        url: item.url,
        thumbnail: getDefaultThumbnail(item.vendorid),
        dok: item.dok,
        type: null,
        rating: {
            teacher: null,
            student: null,
            vendor: null,
        },
        score: null,
        attachments: [],
        vendor: item.vendor,
        vendor_id: item.vendorid
    };
}

function getDefaultThumbnail(vendor) {
    var vendorId,
        vendors = getDefaultThumbnail.vendors,
        thumbnails = getDefaultThumbnail.thumbnails,
        thumbnail;

    if (typeof vendor === 'string') {
        vendorId = vendors.indexOf(vendor);
    } else if (!isNaN(vendor)) {
        vendorId = vendor;
    } else {
        return null;
    }

    thumbnail = thumbnails[vendorId-1];

    return thumbnail ? getDefaultThumbnail.baseUrl + thumbnail : null;
}

getDefaultThumbnail.thumbnails = [
    null,
    'khan-academy120.png',
    'learnzillion-120.png',
    'illuminated-120.png',
    'google-drive-120.png',
    null,
    'flocabulary-120.png',
    'learnzillion-120.png'
];

getDefaultThumbnail.vendors = [
    'YouTube',
    'Khan Academy',
    'LearnZillion',
    'Illuminate Education',
    'Google Drive',
    'Testing sync script',
    'flocabulary.com',
    'matchbook.learnzillion.com'
];

getDefaultThumbnail.baseUrl = 'https://storage.googleapis.com/spark-fusebox/vendor-logos/';

function normalizeAssessment(item) {
    var completed = rnd([true, false]);

    return {
        completed: completed,
        title: item.title,
        url: item.url,
        thumbnail: getDefaultThumbnail(item.vendorid),
        score: completed ? rnd(0, 100) : null,
        attachments: [],
        vendor: item.vendor,
        vendorId: item.vendorid
    };
}

function getFuseboxResources(asnIds, cb) {
    var query = `
    SELECT title,
           url,
           vendorid,
           gradelevel,
           standards,
           standardids,
           v.name AS vendor
      FROM spark1.s2_learn_links
      JOIN spark1.s2_vendors v
        ON v.id = spark1.s2_learn_links.vendorid`,
        params = [],
        where = [];

    if (asnIds.length > 1) {
        params.push(asnIds);
        where.push('standardids ?| $' + params.length);
    } else if (asnIds.length === 1) {
        params.push(asnIds[0]);
        where.push('standardids ? $' + params.length);
    }

    if (where.length) {
        query += ' WHERE ' + where.join(' AND ');
    }

    query += ';';

    db.manyOrNone(query, params).then(function (resources) {
        cb(null, resources.map(normalizeFusebox));
    }, function (err) {
        console.error(err);
        cb(err, []);
    });
}

module.exports = {
    normalizeFusebox: normalizeFusebox,
    getResources: getFuseboxResources,
    normalizeAssessment: normalizeAssessment,
    getDefaultThumbnail: getDefaultThumbnail
};