(function() {
    'use strict';

    var MS_IN_DAY = 86400000;
    var IS_NODE = (typeof window === 'undefined');
    var gradeRangeToArray = require('./util').gradeRangeToArray;
    var daysOffByGrade = {};

    /**
     * Resets time to 00:00:00 on a date
     * @param {date} date - a date object
     */
    function stripTime(date) {
        return new Date(date.toDateString());
    }

    /**
     * Returns true for weekends (Sat/Sun)
     * @param {date} date - a date object
     */
    function isWeekend(date) {
        var day = date.getDay();
        return day === 0 || day === 6;
    }

    /**
     * Returns true for Monday-Friday
     * @param {date} date - a date object
     */
    function isWeekDay(date) {
        return !isWeekend(date);
    }

    /**
     * Returns an array of date objects for every day between startDate and endDate (inclusive)
     * @param {date} startDate - the beginning date object
     * @param {date} endDate - the end date object
     */
    function getDatesBetween(startDate, endDate) {
        startDate = stripTime(startDate);
        endDate = stripTime(endDate);

        var date = startDate,
            dates = [startDate];

        while (date < endDate) {
            date = new Date(date.getTime() + MS_IN_DAY);
            dates.push(date);
        }

        return dates;
    }

    /**
     * Returns the duration between two timestamps IN MILLISECONDS excluding days off and weekends
     * AT A GRANULARITY OF 1 DAY
     * @param {string} grade - the grade (used for multi-campus schools) K for Kindergarten, no leading zeros
     * @param {date} startDate - the beginning date object
     * @param {date} endDate - the end date object
     */
    function getDuration(grade, startDate, endDate) {
        var daysOff = this.daysOffByGrade ? this.daysOffByGrade[grade] : daysOffByGrade ? daysOffByGrade[grade] : {};
        return getDatesBetween(startDate, endDate)
            .filter(function(date) {
                return daysOff[date.toDateString()] !== 1 && !isWeekend(date);
            }).length * MS_IN_DAY;
    }

    /**
     * Returns the duration between two timestamps IN DAYS excluding days off and weekends
     * AT A GRANULARITY OF 1 DAY
     * @param {string} grade - the grade (used for multi-campus schools) K for Kindergarten, no leading zeros
     * @param {date} startDate - the beginning date object
     * @param {date} endDate - the end date object
     */
    function getDurationInDays(grade, startDate, endDate) {
        var daysOff = this.daysOffByGrade ? this.daysOffByGrade[grade] : daysOffByGrade ? daysOffByGrade[grade] : {};
        return getDatesBetween(startDate, endDate)
            .filter(function(date) {
                return daysOff[date.toDateString()] !== 1 && !isWeekend(date);
            }).length;
    }

    /**
     * Takes an object keyed by grade ranges and expands it into an object keyed by grade
     * @param {object} data - an object keyed by grade ranges
     */
    function unpackGradeRanges(data) {
        var byGrade = {};

        for (var range in data) {
            let grades = gradeRangeToArray(range);
            grades.forEach(function(grade) {
                byGrade[grade] = data[range]
            });
        }

        return byGrade;
    }

    /**
     * Returns the grade from a section code, throws when the pattern is not matched (ADV${grade}-#)
     * @param {string} code - a section code
     * @param {string} [kValue='K'] - the value to return for kindergarten
     */
    function sectionCodeToGrade(code, kValue) {
        var matches = code.match(/(\d+|K)-\d+/);

        kValue || (kValue = 'K');

        if (!matches) {
            let err = new Error('Unable to extract grade from section code: ' + code);

            if (IS_NODE) {
                console.error(err);
                return;
            } else {
                throw err; // Throw on staging and live; development environments always return 9
            }
        }

        return matches[1] === 'K' ? kValue : parseInt(matches[1], 10);
    }

    /* INJECT daysOffByGrade */

    if (typeof Ext !== 'undefined' && typeof Ext.define === 'function') {
        Ext.define('Spark.Timing', {
            singleton: true,

            stripTime: stripTime,
            isWeekend: isWeekend,
            isWeekday: isWeekDay,
            getDatesBetween: getDatesBetween,
            sectionCodeToGrade: sectionCodeToGrade,
            unpackGradeRanges: unpackGradeRanges,
            getDurationInDays: getDurationInDays,
            getDuration: getDuration,
            daysOffByGrade: daysOffByGrade
        });
    } else {
        var timingExports = {
            stripTime: stripTime,
            isWeekend: isWeekend,
            isWeekday: isWeekDay,
            getDatesBetween: getDatesBetween,
            sectionCodeToGrade: sectionCodeToGrade,
            unpackGradeRanges: unpackGradeRanges,
            getDurationInDays: getDurationInDays,
            getDuration: getDuration,
            daysOffByGrade: daysOffByGrade
        };

        if (typeof module !== 'undefined') {
            module.exports = timingExports;
        } else {
            window.SparkTiming = timingExports;
        }
    }
})();
