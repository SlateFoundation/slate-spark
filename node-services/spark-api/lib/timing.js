'use strict';

(function() {
    var MS_IN_DAY = 86400000;
    var IS_NODE = (typeof window === 'undefined');
    var gradeRangeToArray = require('./util').gradeRangeToArray;
    var daysOffByGrade = {};

    // Resets time to 00:00:00 on a date
    function stripTime(date) {
        return new Date(date.toDateString());
    }

    // Returns true for weekends (Sat/Sun)
    function isWeekend(date) {
        var day = date.getDay();
        return day === 0 || day === 6;
    }

    // Returns true for Monday-Friday
    function isWeekDay(date) {
        return !isWeekend(date);
    }

    // Returns an array of date objects for every day between startDate and endDate (inclusive)
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

    // Returns the duration between two timestamps IN MILLISECONDS excluding days off AT A GRANULARITY OF 1 DAY
    function getDuration(grade, startDate, endDate) {
        var daysOff = this.daysOffByGrade ? this.daysOffByGrade[grade] : daysOffByGrade ? daysOffByGrade[grade] : {};
        return getDatesBetween(startDate, endDate)
            .filter(d => daysOff[d.toDateString()] !== 1).length * MS_IN_DAY;
    }

    // Returns the duration between two timestamps IN DAYS excluding days off AT A GRANULARITY OF 1 DAY
    function getDurationInDays(grade, startDate, endDate) {
        var daysOff = this.daysOffByGrade ? this.daysOffByGrade[grade] : daysOffByGrade ? daysOffByGrade[grade] : {};
        return getDatesBetween(startDate, endDate)
            .filter(d => daysOff[d.toDateString()] !== 1).length;
    }

    // Takes an object keyed by grade ranges and expands it into an object keyed by grade
    function unpackGradeRanges(data) {
        var byGrade = {};

        for (var range in data) {
            let grades = gradeRangeToArray(range);
            grades.forEach(grade => byGrade[grade] = data[range]);
        }

        return byGrade;
    }

    // Returns the grade from a section code, throws when the pattern is not matched (ADV${grade}-#)
    function sectionCodeToGrade(code, kValue) {
        var matches = code.match(/(\d+|K)-\d+/);

        kValue || (kValue = 'K');

        if (!matches) {
            let err = new Error('Unable to extract grade from section code: ' + code);

            if (IS_NODE) {
                console.error(err);
                return;
            } else {
                throw err;
            }
        }

        return matches[1] === 'K' ? kValue : parseInt(matches[1], 10);
    }

    if (typeof module !== 'undefined') {
        // Node environment
        module.exports = {
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
    } else if (typeof Ext !== 'undefined') {
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
            daysOffByGrade: {}
        });
    }
})();
