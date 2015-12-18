var db = require('./database')();

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
    return {
        completed: false,
        title: item.title,
        url: item.url,
        thumbnail: getDefaultThumbnail(item.vendorid),
        score: null,
        attachments: [],
        vendor: item.vendor,
        vendorId: item.vendorid
    };
}

function* getFuseboxResources(asnIds) {
    var query = `
    SELECT DISTINCT ON (url)
           url,
           title,
           vendorid,
           gradelevel,
           standards,
           standardids,
           v.name AS vendor
      FROM slate1.fusebox_learn_links
      JOIN slate1.fusebox_vendors v
        ON v.id = slate1.fusebox_learn_links.vendorid`,
        params = [],
        where = [],
        resources;

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

    resources = yield db.manyOrNone(query, params);

    return resources.map(normalizeFusebox);
}

module.exports = {
    normalizeFusebox: normalizeFusebox,
    getResources: getFuseboxResources,
    normalizeAssessment: normalizeAssessment,
    getDefaultThumbnail: getDefaultThumbnail
};