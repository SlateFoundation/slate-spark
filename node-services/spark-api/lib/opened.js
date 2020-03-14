'use strict';

const PRODUCTION = process.env.NODE_ENV === 'production';

var generateRandomPassword = require('./password').generateRandomPassword,
    filterObjectKeys = require('./util').filterObjectKeys,
    isGteZero = require('./util').isGteZero,
    qs = require('querystring'),
    util = require('util'),
    defer = require('co-defer'),
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
        'question',
        'other'
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
    updateableUserProperties = {
        first_name: true,
        last_name: true,
        school_nces_id: true
    },
    configError;

require('request-to-curl');

try {
    configFile = fs.readFileSync(configPath, 'utf8');

    try {
        configFile = JSON.parse(configFile)[PRODUCTION ? 'production' : 'staging'];

        // TODO: rework
        openEdClientId = configFile.client_id;
        openEdClientSecret = configFile.client_secret;
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

defer.setImmediate(getAccessToken);

function* getAccessToken(ctx) {
    // HACK: use hard coded account credentials
    if (ctx && ctx.state && ctx.state.preferences) {
        if (ctx.isStudent && ctx.state.preferences.student_opened_token) {
            console.log('OPENED: Using hardcoded student credentials');
            clientOptions.headers.authorization = 'Bearer ' + ctx.state.preferences.student_opened_token;
            return ctx.state.preferences.student_opened_token;
        }

        if (ctx.isTeacher && ctx.state.preferences.teacher_opened_token) {
            console.log('OPENED: Using hardcoded teacher credentials');
            clientOptions.headers.authorization = 'Bearer ' + ctx.state.preferences.teacher_opened_token;
            return ctx.state.preferences.teacher_opened_token;
        }
    }

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

function* getResources(params, resources, ctx) {
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

    yield getAccessToken(ctx);

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

        if ((entries + offset) < total_entries) {
            params.offset = (entries + offset);
            console.log(`OPENED: Retrieving paged resources ${entries + offset}/${total_entries}`);
            yield* getResources(params, resources, ctx);
        } else {

        }
    }

    console.log('OpenEd resources: ' + resources.length);

    return {
        resources: resources
    };
}

// Merit Prep: 340076003235
// Michigan Technical Academy Elementary: 260012801506
// Michigan Technical Academy Middle: 26001280143

/*
 OPENED: HTTP 422 is not what we expected:
 { error:
 { email: [ 'has already been taken' ],
 username: [ 'has already been taken' ] } }
 */
function* createUser(user, ctx) {
    var url = '/users',
        params = user,
        response;

    params.client_id = openEdClientId;

    yield getAccessToken();

    user.client_id = openEdClientId;

    if (!user.password) {
        user.password = (yield generateRandomPassword());
    }

    clientOptions.uri = openEdClientBaseUrl + url;
    clientOptions.body = params;
    clientOptions.method = 'POST';

    response = yield request(clientOptions);

    delete clientOptions.uri;
    delete clientOptions.body;
    delete clientOptions.method;

    if (response.statusCode >= 400 || // HTTP error
        typeof response.body !== 'object' || // empty body
        typeof response.body.user !== 'object' // missing user property
    ) {
        console.error('OPENED: HTTP ' + response.statusCode + ' is not what we expected: ');
        console.error(response.body);
        console.error(response.request.req.toCurl());

        throw new Error(`Unable to create user ${params.username}: HTTP ${response.statusCode}`);
    }

    if (ctx.setPreferences) {
        ctx.setPreferences({
            opened_user: response.body.user
        });
    }

    return response.body.user;
}

function* findUser(emailOrUsername) {
    var url = '/users/search',
        response;

    yield getAccessToken();

    // TODO: use request qs option once clientOptions isn't shared
    clientOptions.uri = openEdClientBaseUrl + url + '?' + qs.stringify({username: emailOrUsername});

    response = yield request(clientOptions);

    delete clientOptions.uri;
    delete clientOptions.body;
    delete clientOptions.method;

    if (response.statusCode >= 400 || // HTTP error
        typeof response.body !== 'object' || // empty body
        typeof response.body.user !== 'object' // missing user property
    ) {
        if (response.statusCode != 404) {
            console.error('OPENED: HTTP ' + response.statusCode + ' is not what we expected: ');
            console.error(response.body);
            console.error(response.request.req.toCurl());
        }

        return null;
    }

    return response.body.user;
}

function* updateUser(userId, user = {}, ctx) {
    var updatedProperties = {},
        url = `/users/${userId}`,
        response;

    userId = parseInt(userId, 10);

    if (isNaN(userId)) {
        throw new Error('userId is required');
    }

    // TODO: maybe throw a warning here if there are static properties in development mode
    for (var key in updateableUserProperties) {
        let val = user[key];

        if (val) {
            updatedProperties[key] = val;
        }
    }

    yield getAccessToken();

    clientOptions.uri = openEdClientBaseUrl + url;
    clientOptions.body = updatedProperties;
    clientOptions.method = 'PUT';

    response = yield request(clientOptions);

    delete clientOptions.uri;
    delete clientOptions.body;
    delete clientOptions.method;

    if (response.statusCode >= 400 || // HTTP error
        typeof response.body !== 'object' || // empty body
        typeof response.body.user !== 'object' // missing user property
    ) {
        if (response.statusCode != 404) {
            console.error('OPENED: HTTP ' + response.statusCode + ' is not what we expected: ');
            console.error(response.body);
            console.error(response.request.req.toCurl());
        }

        return null;
    }

    if (ctx.setPreferences) {
        ctx.setPreferences({
            opened_user: response.body.user
        });
    }

    return response.body.user;
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
        thumbnail: 'https://storage.googleapis.com/spark-fusebox/vendor-logos/opened-120.png',
        dok: null,
        type: item.resource_type,
        rating: {
            vendor: item.rating
        },
        score: null,
        attachments: [],
        vendor: item.contribution_name,
        premium: !!item.is_premium,
        effectiveness: item.effectiveness || null
    };
}

function generateLaunchUrl(options = {}) {
    /*
    share_url: This url is formated for teachers and optimized for an iframe.
    student_url: This url is formated for students and optimized for an iframe.  Additional parameters can be appened to these urls in order to customize the users experience. Below is a list of parameters you can use.
    Parameter	Values	Description
    `simplifiedView`	true | false	This parameter removes header/footer on OpenEd page and optimizes for iframe.
                                                                                                                  `student_view`	true | false	This parameter removes teacher messaging and actions on OpenEd page.
    `oauth_access_token`	{ACCESS_TOKEN}	This is the access token returned from the `get_token` API call. You will need to login each student by passing their username in the `get_token` API call. By then adding their ACCESS_TOKEN to the resource url, they will be automatically logged into OpenEd and resource usage data can be tracked. This is extremely valuable to track your students usage of resources for future recommendations.
    hideRelatedResources	true | false	This will hide the related resource list on the right side of the resource details pages.*/
}

module.exports = {
    normalize: normalize,
    getResources: getResources,
    getAccessToken: getAccessToken,
    findUser: findUser,
    createUser: createUser,
    updateUser: updateUser,
    getUserAccessToken: getAccessToken,
    studentResourceTypes: studentResourceTypes,
    generateLaunchUrl: generateLaunchUrl
};
