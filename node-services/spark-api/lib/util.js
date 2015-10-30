'use strict';

var lookup = require('./lookup');

/** @module util */

/**
 * A helper function to generate random numbers and pick random (un)weighted values from a set of values
 *
 * @example
 * // returns a random number between min and max (defaults to 0,100 if called with no arguments)
 * rnd(min,max)
 *
 * @example
 * // returns a random value from array (evenly weighted)
 * rnd(['a', 'b', 'c'])
 *
 * @example
 * // returns a random value key weighted by val (win: 89%, mac: %9, lin: 2%)
 * rnd({win: .89,  mac: .09 , lin: .02})
 *
 * @example
 * // returns a random truthy/falsey value (50/50)
 * rnd(0,1)
 *
 * @example
 * // returns a random boolean value (50/50)
 * rnd([true, false])
 *
 * @example
 * // returns 'pizza' (1:2) 'chicken fingers' (1:4) or 'cheese streak' (1:4)
 * rnd({'pizza': .5, 'chicken fingers': .25, 'cheese steak': .25})
 *
 * @alias module:util.rnd
 *
 * @param {Object|Array|Number} a
 * @param {Number} b
 * @returns {Number|String|Boolean|Array|Object} randomValue
 */
function rnd(a, b) {
    // Calling rnd() with no arguments is identical to rnd(0, 100)
    a = a || 0;
    b = b || 100;

    if (typeof b === 'number' && typeof a === 'number') {
        // rnd(int min, int max) returns integer between min, max
        return (function (min, max) {
            if (min > max) {
                throw new RangeError('expected min <= max; got min = ' + min + ', max = ' + max);
            }
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }(a, b));
    }

    if (Object.prototype.toString.call(a) === '[object Array]') {
        // Returns a random element from array (a), even weighting
        return a[Math.floor(Math.random() * a.length)];
    }

    if (a && typeof a === 'object') {
        // Returns a random key from the passed object; keys are weighted by the decimal probability in their value
        return (function (obj) {
            var rand = rnd(0, 100) / 100, min = 0, max = 0, key, returnVal;

            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    max = obj[key] + min;
                    returnVal = key;
                    if (rand >= min && rand <= max) {
                        break;
                    }
                    min = min + obj[key];
                }
            }

            return returnVal;
        }(a));
    }

    throw new TypeError('Invalid arguments passed to rnd. (' + (b ? a + ', ' + b : a) + ')');
}

/**
 * Returns a copy of an object minus the properties in keys
 *
 * @alias module:util.filterObjectKeys
 *
 * @param {Array} keys
 * @param {Object} obj
 * @returns {Object}
 */
function filterObjectKeys(keys, obj) {
    var filteredObj = {};

    Object
        .keys(obj)
        .filter(function (key) {
            return keys.indexOf(key) !== -1;
        }).forEach(function (key) {
            filteredObj[key] = obj[key];
        });

    return filteredObj;
}


/**
 * Returns an array of grades when provided a range (including sprase ranges).
 *
 * @see {@link module:util.arrayToGradeRange} for the reverse of this function.
 *
 * **Important:** The output when using `returnsNumber=true` is not valid input for `arrayToGradeRange`
 *
 * @example
 * // returns [ 'PK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12' ]
 * gradeRangeToArray('PK-2,3-5,6-8,9-12')
 *
 * @example
 * // returns [ 'K', '1', '2', '3', '4', '5', '6', '7', '8' ]
 * gradeRangeToArray('K-8')
 *
 * @example
 * // returns [ -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ]
 * gradeRangeToArray('P-2,3-5,6-8,9-12', true)
 *
 * @alias module:util.gradeRangeToArray
 *
 * @param {String} gradeRange
 * @param {Boolean} [returnNumbers=false]
 * @returns {Array}
 */
function gradeRangeToArray(gradeRange, returnNumbers) {
    // Inspired by Joseph the Dreamer (http://codereview.stackexchange.com/a/26138)
    var nums = [],
        entries = gradeRange.toString().toLowerCase(),
        hasAlphaGrades = entries.indexOf('k') !== -1,
        low, high, range;

    entries = entries.split(',');

    returnNumbers = typeof returnNumbers === 'boolean' ? returnNumbers : false;

    if (hasAlphaGrades) {
        entries = entries.map(function (entry) {
            return entry.split('-').map(function (chunk) {
                if (chunk === 'p' || chunk === 'pk') {
                    return '0';
                }

                if (chunk === 'k') {
                    return '1';
                }

                return (parseInt(chunk, 10) + 1).toString();
            }).join('-');
        });
    }

    entries.forEach(function (entry, i) {
        if (entry.indexOf('-') === -1) {
            nums.push(+entry);
        } else {
            range = entry.split('-');
            low = +range[0];
            high = +range[1];

            if (high < low) {
                low = low ^ high;
                high = low ^ high;
                low = low ^ high;
            }

            while (low <= high) {
                nums.push(low++);
            }
        }
    });

    nums = nums.sort(function (a, b) {
        return a - b;
    });

    if (hasAlphaGrades) {
        nums = nums.map(function (grade) {
            if (!returnNumbers && grade === 0) {
                return 'P';
            } else if (!returnNumbers && grade === 1) {
                return 'K';
            }

            return grade - 1;
        });
    }

    if (returnNumbers) {
        return nums;
    } else {
        return nums.map(function (num) {
            return num.toString();
        });
    }
}


/**
 * Returns a grade range as a string (including sprase ranges).
 *
 * @see {@link module:util.gradeRangeToArray} for the reverse of this function.
 *
 * @example
 * // returns 'PK-2,3-5,6-8,9-12'
 * arrayToGradeRange([ 'PK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12' ], 'PK')
 *
 * @example
 * // returns 'K-8'
 * arrayToGradeRange([ 'K', '1', '2', '3', '4', '5', '6', '7', '8' ])
 *
 * @alias module:util.arrayToGradeRange
 *
 * @param {Array} input
 * @param {String} [pkStr=P] - the abbreviation to use for Pre-Kindergarten
 * @returns {String}
 */
function arrayToGradeRange(input, pkStr) {
    var ret = [],
        ary, first, last, i, len;
    // Inspired by: http://stackoverflow.com/a/2271410/1337301

    // Cast grades to integers and replace K with 1 and PK with 0
    input = input.map(function (grade) {
        grade = grade.toString().toLowerCase();

        if (grade.indexOf('/') !== -1) {
            grade = grade.split('/').pop();
        }

        return (grade === 'k') ? 1 : (grade.charAt(0) === 'p') ? 0 : (parseInt(grade, 10) + 1);
    });

    // Copy and sort
    ary = input.concat([]);
    ary.sort(function (a, b) {
        return Number(a) - Number(b);
    });

    for (i = 0, len = ary.length; i < len; i++) {
        first = last = ary[i];

        while (ary[i + 1] === last + 1) {
            last++;
            i++;
        }

        ret.push(
            first === last ? (first > 1 ? -1 : (first === 0 ? 'P' : 'K'))
                : (first > 1 ? first - 1 : (first === 0 ? 'P' : 'K')) + '-' +
            (last > 1 ? last - 1 : (last === 0 ? 'P' : 'K')));
    }

    ret = ret.join(',');

    if (ret.charAt(0) === '1') {
        ret = 'K' + ret.substr(1);
    } else if (ret.charAt(0) === '0') {
        ret = 'P' + ret.substr(1);
    }

    if (ret === '1') {
        return 'K';
    }

    if (ret === '0') {
        return 'P';
    }

    return ret;
}


/**
 * Returns a boolean indicating whether the given string is a number greater than zero
 *
 * @alias module:util.isGteZero
 *
 * @param {String} str
 * @returns {Boolean}
 */
function isGteZero(str) {
    str = parseInt('' + str, 10);
    return !isNaN(str) && str >= 0;
}


/**
 * Returns a boolean indicating whether the given string contains an ASN ID in the following format:
 * - 56-bit (7 character) hexadecimal numbers prefixed with S (8 characters total)
 *
 * @alias module:util.isAsnId
 *
 * @param {String} code
 * @returns {Boolean}
 */
function isAsnId(code) {
    return (/^S[\dA-F]{7}$/).test('' + code);
}


/**
 * Returns a boolean indicating whether the given string contains a Matchbook ID in the following format:
 * - zero-filled decimal numbers with a maximum value of 9,999,999 prefixed with M (8 characters total)
 *
 * @alias module:util.isMatchbookId
 *
 * @param {String} code
 * @returns {Boolean}
 */
function isMatchbookId(code) {
    // Matchbook IDs are
    return (/^M[\dA-F]{7}$/).test('' + code);
}


/**
 * Returns a boolean indicating whether the given string contains an ASN or Matchbook ID in the following formats:
 * - Matchbook: zero-filled decimal numbers with a maximum value of 9,999,999 prefixed with M (8 characters total)
 * - ASN: 56-bit (7 character) hexadecimal numbers prefixed with S (8 characters total)
 *
 * @alias module:util.isAsnStyleId
 *
 * @param {String} code
 * @returns {Boolean}
 */
function isAsnStyleId(code) {
    return (/^[SM][\dA-F]{7}$/).test('' + code);
}

function toSparkpointId(sparkpoint) {
    sparkpoint = '' + sparkpoint;

    if (isAsnId(sparkpoint)) {
        return lookup.standard.idToSparkpointId[sparkpoint];
    }

    return isMatchbookId(sparkpoint) ? sparkpoint : lookup.sparkpoint.codeToId[sparkpoint.toLowerCase()];
}

function toSparkpointCode(sparkpoint) {
    sparkpoint = '' + sparkpoint;

    if (isMatchbookId(sparkpoint)) {
        return lookup.sparkpoint.idToCode[sparkpoint];
    }

    if (isAsnId(sparkpoint)) {
        return lookup.sparkpoint.idToCode[lookup.standard.idToSparkpointId[sparkpoint]];
    }

    return lookup.sparkpoint.idToCode[lookup.sparkpoint.codeToId[sparkpoint.toLowerCase()]];
}

function toSparkpointIds(str) {
    var returnVal = [];

    ('' + str).split(',').forEach(function (sparkpoint) {
        sparkpoint = toSparkpointId(sparkpoint);

        if (sparkpoint) {
            returnVal.push(sparkpoint);
        }
    });

    return returnVal;
}

function toSparkpointCodes(str) {
    var returnVal = [];

    ('' + str).split(',').forEach(function (sparkpoint) {
        sparkpoint = toSparkpointCode(sparkpoint);

        if (sparkpoint) {
            returnVal.push(sparkpoint);
        }
    });

    return returnVal;
}

function toAsnId(asnId) {
    asnId = '' + asnId;

    if (isAsnId(asnId)) {
        return asnId;
    }

    return lookup.standard.codeToId[asnId];
}

function toStandardCode(standardCode) {
    standardCode = '' + standardCode;

    if (isAsnId(standardCode)) {
        return lookup.standard.idToCode[standardCode];
    }

    return lookup.standard.idToCode[lookup.standard.codeToId[standardCode.toLowerCase()]];
}

function toAsnIds(str) {
    var returnVal = [];

    ('' + str).split(',').forEach(function (standard) {
        standard = toAsnId(standard);

        if (standard) {
            returnVal.push(standard);
        }
    });

    return returnVal;
}

function toStandardCodes(str) {
    var returnVal = [];

    ('' + str).split(',').forEach(function (standard) {
        standard = toStandardCode(standard);

        if (standard) {
            returnVal.push(standard);
        }
    });

    return returnVal;
}

function requireParams(params, req, res) {
    console.log(params);

    var missing = params.filter(function (param) {
        return typeof req.params[param] === 'undefined';
    });

    console.log(req.params);
    console.log(req.body);
    console.log(missing);

    if (missing.length > 0) {
        res.statusCode = 400;
        res.json({
            error: 'Missing required parameter(s): ' + missing.join(', '),
            params: req.params
        });
        return missing;
    }

    return false;
}

module.exports = {
    filterObjectKeys: filterObjectKeys,
    rnd: rnd,

    isGteZero: isGteZero,
    isAsnId: isAsnId,
    isMatchbookId: isMatchbookId,
    isAsnStyleId: isAsnStyleId,

    arrayToGradeRange: arrayToGradeRange,
    gradeRangeToArray: gradeRangeToArray,

    toSparkpointIds: toSparkpointIds,
    toSparkpointCodes: toSparkpointCodes,
    toSparkpointId: toSparkpointId,
    toSparkpointCode: toSparkpointCode,

    toAsnIds: toAsnIds,
    toStandardCodes: toStandardCodes,
    toAsnId: toAsnId,
    toStandardCode: toStandardCode,

    requireParams: requireParams
};
