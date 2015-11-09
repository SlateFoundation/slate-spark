'use strict';

var filterObjectKeys = require('./util').filterObjectKeys,
    isGteZero = require('./util').isGteZero,
    qs = require('querystring'),
    Promise = require('bluebird'),
    request = require('koa-request'),
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
        'contribution_name'
    ],

    sparkParameters = [
        'role',
        'resource_types'
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

    openEdAccessToken = null,
    openEdRefreshToken = null,
    openEdRenewalInterval,
    openEdClientSecret = '',
    openEdClientId = '',
    openEdClientBaseUrl = 'https://api.opened.io',
    configFile,
    openEdClient,
    clientOptions = {
        headers: {
            accept: 'application/json'
        },
        json: true,
        timeout: 2000
    };

try {
    configFile = fs.readFileSync(path.resolve(__dirname, '../config/opened.json'), 'utf8');
    try {
        configFile = JSON.parse(configFile);

        openEdClientId = configFile.opened_client_id;
        openEdClientSecret = configFile.opened_client_secret;

    } catch (err) {
        console.error('OPENED: Error parsing ' + path.resolve(__dirname, '../config.json'));
        process.exit(1);
    }
} catch (err) {
    if (openEdClientSecret === '' || openEdClientId === '') {
        console.error('OPENED: Please provide a valid config.json in ' + path.resolve(__dirname, '../config.json') + ' or edit the content-proxy file directly.');
        console.error(err);
        process.exit(1);
    }
}

if (openEdClientSecret === '' || openEdClientId === '') {
    console.error('OPENED: Please provide a valid config.json in ' + path.resolve(__dirname, '../config.json') + ' or edit the content-proxy file directly.');
    process.exit(1);
}

function* getAccessToken() {
    var params = {
        client_id: openEdClientId,
        client_secret: openEdClientSecret,
        grant_type: 'client_credentials'
    },
    token;

    if (openEdRefreshToken) {
        params.grant_type = 'refresh_token';
        params.refresh_token = openEdRefrescbToken;
    }

    // clear existing token
    delete clientOptions.headers.authorization;

    clientOptions.uri = openEdClientBaseUrl + '/oauth/token';
    clientOptions.body = params;
    clientOptions.method = 'POST';

    token = yield request(clientOptions);

    delete clientOptions.body;
    delete clientOptions.uri;
    delete clientOptions.method;

    // Automatically renew our access token 30 seconds before it is set to expire
    if (openEdRenewalInterval) {
        clearInterval(openEdRenewalInterval);
    }

    token = token.body;

    openEdRenewalInterval = setInterval(getAccessToken, (parseInt(token.expires_in, 10) - 30) * 1000);
    openEdAccessToken = token.access_token;
    openEdRefreshToken = token.refresh_token;

    // set new token
    clientOptions.headers.authorization = 'Bearer ' + openEdAccessToken;

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

            break;

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

        case 'resource_types':
            var resourceTypes = val.toString().toLowerCase().split(','),
                invalidResourceTypes = resourceTypes.filter(function (resourceType) {
                    return validResourceTypes.indexOf(resourceType) === -1;
                });

            if (invalidResourceTypes.length > 0 && re.isString.test(val)) {
                return 'resource_types expects one or more of the following separated by commas: ' +
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
        case 'resource_types':
            return val.toLowerCase();

        default:
            return val;
    }
}


function generateErrorString(err) {
    var errMsg = err.message ? err.message.toString().trim() : 'No error message provided by OpenEd';
    return '(HTTP ' + err.statusCode + ') - ' + errMsg;
}

function* getResources(params) {
    var url = '/resources.json',
        resourceTypes = params.resource_types ? Array.isArray(params.resource_types) ? params.resource_types : params.resource_types.split(',') : [],
        queryString = qs.stringify(filterObjectKeys(openEdParameters, params)),
        resources;

    if (resourceTypes.length > 0) {
        queryString += (queryString !== '' ? '&' : '') + resourceTypes.map(function (resourceType) {
                return 'resource_types[]=' + resourceType;
            }).join('&');
    }

    if (queryString !== '') {
        url += '?' + queryString;
    }

    if (!openEdAccessToken) {
        yield getAccessToken();
    }

    clientOptions.uri = openEdClientBaseUrl + url;

    resources = yield request(clientOptions);

    if (resources.statusCode !== 200 || // HTTP error
        typeof resources.body !== 'object' || // empty body
        !Array.isArray(resources.body.resources) || // missing resource property
        resources.body.resources.length === 0 // coverage gap
    ) {
        console.error('OPENED: HTTP ' + resources.statusCode + ' is not what we expected: ');
        console.log(clientOptions);
        console.error(resources);
        return resources;
    }

    return resources.body;
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
        title: item.title,
        url: item.share_url,
        thumbnail: item.thumb,
        dok: null,
        type: item.resource_type,
        rating: {
            teacher: item.rating,
            student:  item.rating,
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