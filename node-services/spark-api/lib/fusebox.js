var db = require('./database');

function normalizeFusebox(item) {
    return {
        completed: false,
        title: item.title,
        url: item.url,
        thumbnail: getDefaultThumbnail(item.vendorid),
        dok: item.dok || null,
        type: item.type,
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
        resource_id: item.id,
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
    if (asnIds.length === 0) {
        return [];
    }

    var query = /*language=SQL*/ `
    SELECT DISTINCT ON (url)
           url,
           title,
           vendorid,
           gradelevel,
           standards,
           standardids,
           v.name AS vendor,
           (ll.creatorid = 3) AS bulk_loaded
      FROM slate1.fusebox_learn_links ll
      JOIN slate1.fusebox_vendors v
        ON v.id = ll.vendorid`,
        params = [],
        where = [],
        resources;

    if (asnIds.length > 1) {
        params.push(asnIds);
        where.push('standardids ?| $' + params.length + '::char(8)[]');
    } else if (asnIds.length === 1) {
        params.push(asnIds[0]);
        where.push('standardids ? $' + params.length);
    }

    // HACK: Exclude bulk-loaded OpenEd content
    where.push('NOT (vendorid = 34 AND ll.creatorid = 3) ');

    if (where.length) {
        query += ' WHERE ' + where.join(' AND ');
    }

    // Fusebox content is ordered by the date it was created and whether or not it was bulk loaded (creatorid = 3)
    query += `ORDER BY url,
                       ll.created DESC,
                       ll.creatorid != 3 DESC,
                       ll.title ILIKE '%learning target%';`;

    resources = yield db.manyOrNone(query, params);

    return resources.map(normalizeFusebox);
}

module.exports = {
    normalizeFusebox: normalizeFusebox,
    getResources: getFuseboxResources,
    normalizeAssessment: normalizeAssessment,
    getDefaultThumbnail: getDefaultThumbnail
};