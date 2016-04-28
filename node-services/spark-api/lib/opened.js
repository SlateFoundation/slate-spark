'use strict';

var filterObjectKeys = require('./util').filterObjectKeys,
    k12 = require('k-12'),
    isGteZero = require('./util').isGteZero,
    qs = require('querystring'),
    Promise = require('bluebird'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter,
    request = require('koa-request'),
    spex = require('spex')(Promise),
    path = require('path'),
    fs = require('fs'),

    re = {
        isNumeric: /\d+/,
        isString: /\w+/,
        isGradeGroup: /elementary|(?:middle|high) school/i,
        isGrade: /K|1|2|3|4|5|6|7|8|9|10|11|12|HS|MS/i,
        isRole: /student|teacher|service/i
    },

    /* ============= CONFIGURATION ============= */
    openEdParameters = [
        // OpenEd
        'limit',
        'offset',
        'descriptive',
        'standard_group',
        'category',
        'standard',
        'area',
        'subject',
        'grade',
        'grade_group_string',
        'contribution_name',
        'license'
    ],

    sparkParameters = [
        'role',
        'resource_type',
        'standard_ids'
    ],

    validParameters = openEdParameters.concat(sparkParameters),

    validResourceTypes = [
        'assessment',
        'video',
        'homework',
        'exercise',
        'game',
        'lesson_plan',
        'other',
        'question'
    ],

// Default resource_types filter for ?role=student
    studentResourceTypes = [
        'video',
        'homework',
        'exercise',
        'game',
        'question'
    ],

    openEdSubjects = [
        'Other History',
        'Geography',
        'Chemistry',
        'Environmental Science',
        'California',
        'Video',
        'Earth and Space Science',
        'Technology Literacy',
        'Fine Arts',
        'Grammar',
        'Reading Science and Technical Subjects (9-12)',
        'Foreign Languages',
        'Hobbies',
        'Drama & Theater ',
        'Measurement & Data',
        'Number Sense and Operations',
        'Physical Science',
        'New York',
        'Scientific Investigation',
        'Language',
        'Life Science',
        'Engineering and Technology',
        'Reading',
        'Career Readiness',
        'Civics',
        'Culture',
        'Reading History/Social Studies (9-12)',
        'Test Prep',
        'US History',
        'Expressions, Equations and Inequalities',
        'History of Science',
        'Reading History/Social Studies (6-8)',
        'Algebra',
        'Writing History/Social Studies, Science, and Technical Subjects (9-12)',
        'Other Math',
        'Functions',
        'Health and Physical Education',
        'Statistics and Probability',
        'Economics',
        'Pre-Calc and Calculus',
        'Teaching Resources',
        'Computer Science',
        'World History',
        'Research',
        'Writing in History/Social Studies, Science, and Technical Subjects (6-8)',
        'Music ', // Trailing space is on their end
        'Geometry',
        'Trigonometry',
        'Reading Science and Technical Subjects (6-8)',
        'Writing',
        'Speaking and Listening'
    ],

    openEdAreas = [
        'Mathematics',
        'Language Arts',
        'Social Studies',
        'Science',
        'Other',
        'Technology',
        'Elective Subjects',
        'Literacy'
    ],

    openEdUsername,
    openEdAccessToken = null,
    openEdRefreshToken = null,
    openEdTokenExpiration = new Date().getTime(),
    openEdClientSecret = '',
    openEdClientId = '',
    openEdClientBaseUrl = 'https://partner.opened.com/1',
    configFile,
    clientOptions = {
        headers: {
            accept: 'application/json'
        },
        json: true,
        timeout: 2000,
        forever: true,
        pool: {
            maxSockets: 50
        }
    },
    configPath = path.resolve(__dirname, '../config/opened.json'),
    configError;

require('request-to-curl');

try {
    configFile = fs.readFileSync(configPath, 'utf8');

    try {
        configFile = JSON.parse(configFile);

        // TODO: rework
        openEdClientId = configFile.opened_client_id;
        openEdClientSecret = configFile.opened_client_secret;
        openEdClientBaseUrl = configFile.base_url || openEdClientBaseUrl;
        openEdUsername = configFile.username || 'jeff@slate.is';
    } catch (err) {
        configError = 'Error parsing JSON';
    }
} catch (err) {
    configError = 'Unable to read';
}

if (!(openEdClientSecret && openEdClientId && openEdUsername)) {
    configError = 'opened_client_id, opened_client_secret, and username are required';
}

if (configError) {
    throw new Error(`OpenEd: ${configPath}: ${configError}`);
}

function* getAccessToken() {
    if (new Date().getTime() < openEdTokenExpiration) {
        return openEdAccessToken;
    } else {
        console.log(`OPENED: ${openEdAccessToken} access token expired, renewing...`);
    }

    var params = {
        client_id: openEdClientId,
        secret: openEdClientSecret,
        grant_type: 'client_credentials',
        username: openEdUsername
    },
    token;

    if (openEdRefreshToken) {
        params.grant_type = 'refresh_token';
        params.refresh_token = openEdRefreshToken;
    }

    // clear existing token
    delete clientOptions.headers.authorization;

    clientOptions.uri = openEdClientBaseUrl + '/oauth/get_token';
    clientOptions.body = params;
    clientOptions.method = 'POST';

    token = yield request(clientOptions);

    if (token.statusCode >= 400 || // HTTP error
        typeof token.body !== 'object' || // empty body
        typeof token.body.access_token !== 'string' || // missing access_token
        typeof token.body.access_token !== 'string' // missing refresh_token
    ) {
        console.error('OPENED: HTTP ' + token.statusCode + ' is not what we expected: ');
        console.error(token.body);
        console.error(token.request.req.toCurl());

        return token;
    }

    delete clientOptions.body;
    delete clientOptions.uri;
    delete clientOptions.method;

    token = token.body;

    openEdAccessToken = token.access_token;
    openEdRefreshToken = token.refresh_token;
    clientOptions.headers.authorization = 'Bearer ' + openEdAccessToken;

    openEdTokenExpiration = new Date().getTime() + (parseInt(token.expires_in, 10) * 1000);

    return openEdAccessToken;
}

function validateParam(param, val) {
    switch (param) {
        case 'category':
        case 'contribution_name':
        case 'descriptive':
        case 'grade_group_string':
        case 'standard':
            if (val.toString().trim().length === 0) {
                return param + ' accepts a string as input, you passed: "' + val + '"';
            }

        case 'grade_group_string':
            if (!re.isGradeGroup(val)) {
                return 'grade_group_string can be Elementary, Middle School, or High School. You passed: ' + val;
            }

            break;

        case 'standard_group':
            if (!isGteZero(val)) {
                return 'standard_group is should be a numeric identifier. You passed: ' + val;
            }

            break;

        case 'resource_type':
            var resourceTypes = val.toString().toLowerCase().split(','),
                invalidResourceTypes = resourceTypes.filter(function (resourceType) {
                    return validResourceTypes.indexOf(resourceType) === -1;
                });

            if (invalidResourceTypes.length > 0 && re.isString.test(val)) {
                return 'resource_type expects one or more of the following separated by commas: ' +
                    validResourceTypes.join(', ') + '. The following value(s) are invalid: ' +
                    invalidResourceTypes.join(', ');
            }

            break;

        case 'grade':
            /* This validation does not catch invalid upper bounds in ranges, 6-15 will not throw an error, it will be
             trimmed during the transformation stage. */

            var grades = val.toString().split(','),
                invalidGrades = grades.filter(function (grade) {
                    return !re.isGrade.test(grade);
                });

            if (invalidGrades.length > 0 || !re.isString.test(val)) {
                return 'grade expects a grade range (6-8), a single value or array of comma separated values K-12, ' +
                    ' MS (6-8), or HS (9-12) you passed: ' + invalidGrades.join(', ');
            }

            break;

        case 'subject':
            if (openEdSubjects.indexOf(val) === -1) {
                return 'subject expects one of the following values: ' + openEdSubjects.join(', ');
            }

            break;

        case 'area':
            if (openEdAreas.indexOf(val) === -1) {
                return 'area expects one of the following values: ' + openEdAreas.join(', ');
            }

            break;

        case 'offset':
            if (!isGteZero(val)) {
                return 'offset should be a number greater than or equal to zero. You passed: ' + val;
            }

            break;

        case 'limit':
            var limit = parseInt(val, 10);

            if (isNaN(limit) || limit < 1 || limit > 100) {
                return 'limit should be a number between 1 and 100. You passed: ' + val;
            }

            break;

        case 'role':
            if (!re.isRole.test((val))) {
                return 'role should be either teacher, student or service. You passed: ' + val;
            }

            break;

        default:
            return param + ' is not a valid parameter. Valid parameters are: ' + validParameters.join(', ');
    }
}

function transformParam(param, val) {
    val = '' + val;

    switch (param) {
        case 'grade_group_string':
            return {
                'elementary': 'Elementary',
                'middle school': 'Middle School',
                'high school': 'High School'
            }[val.toLowerCase()];

        case 'grade':
            var grade = val
                .toUpperCase()
                .replace('HS', '9,10,11,12')
                .replace('MS', '6,7,8')
                .replace('K', '0');

            // expand grade ranges
            if (grade.indexOf('-') !== -1) {
                grade = gradeRangeToArray(grade);
            } else {
                grade = grade.split(',');
            }

            // remove dupes and replace 0 with kindergarten
            grade = grade.filter(function (item, pos, self) {
                return item <= 12 && self.indexOf(item) === pos;
            }).join(',').replace(/^0/, 'K');

            return grade;

        case 'role':
        case 'resource_type':
            return val.toLowerCase();

        default:
            return val;
    }
}


function generateErrorString(err) {
    var errMsg = err.message ? err.message.toString().trim() : 'No error message provided by OpenEd';
    return '(HTTP ' + err.statusCode + ') - ' + errMsg;
}

function* getResources(params, resources) {
    var url = '/resources.json',
        resourceTypes = params.resource_type ? Array.isArray(params.resource_type) ? params.resource_type : params.resource_type.split(',') : [],
        standardIds = params.standard_ids ? Array.isArray(params.standard_ids) ? params.standard_ids : params.standard_ids.split(',') : [],
        queryString = qs.stringify(filterObjectKeys(openEdParameters, params)),
        response;

    if (resourceTypes.length > 0) {
        queryString += (queryString !== '' ? '&' : '') + resourceTypes.map(function (resourceType) {
                return 'resource_type[]=' + resourceType;
            }).join('&');
    }

    if (standardIds.length > 0) {
        queryString += (queryString !== '' ? '&' : '') + standardIds.map(function (standardId) {
                return 'standard_ids[]=' + standardId;
            }).join('&');
    }

    if (queryString !== '') {
        url += '?' + queryString;
    }

    yield getAccessToken();

    clientOptions.uri = openEdClientBaseUrl + url;

    response = yield request(clientOptions);

    if (response.statusCode >= 400 || // HTTP error
        typeof response.body !== 'object' || // empty body
        !Array.isArray(response.body.resources) || // missing resource property
        response.body.resources.length === 0 // coverage gap
    ) {
        console.error('OPENED: HTTP ' + response.statusCode + ' is not what we expected: ');
        console.error(response.body);
        console.error(response.request.req.toCurl());

        return response;
    }

    resources = resources ? resources.concat(response.body.resources) : response.body.resources;

    if (response.body.meta && response.body.meta.pagination) {
        let {limit, offset, entries, total_entries} = response.body.meta.pagination;

        console.log(`OPENED: Retrieving paged resources ${entries + offset}/${total_entries}`);

        if ((entries + offset) < total_entries) {
            params.offset = (entries + offset);
            yield getResources(params, resources);
        }
    }

    return {
        resources: resources
    };
}

function validateParams(params) {
    var errors = [],
        param, val, error;

    for (param in params) {
        val = params[param];

        error = validateParam(param, val);

        if (error) {
            errors.push(error);
        } else {
            params[param] = transformParam(param, val);
        }
    }

    return errors;
}

function normalize(item) {
    return {
        completed: false,
        title: (!!item.is_premium ? '$$$ ' : '') + (item.resource_type !== 'video' ? '*** ' : '') + item.title + (item.resource_type !== 'video' ? ` (${item.resource_type})` : ''),
        url: item.share_url,
        thumbnail: item.thumb,
        dok: null,
        type: item.resource_type,
        rating: {
            vendor: item.rating
        },
        score: null,
        attachments: [],
        vendor: item.contribution_name,
        premium: !!item.is_premium
    };
}

module.exports = {
    normalize: normalize,
    getResources: getResources,
    getAccessToken: getAccessToken,
    studentResourceTypes: studentResourceTypes
};
