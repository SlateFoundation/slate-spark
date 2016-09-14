'use strict';

var babel = require('babel-core'),
    ical = require('ical'),
    timing = require('../../lib/timing'),
    gradeRangeToArray = require('../../lib/util').gradeRangeToArray,
    slateConfig = require('../../config/slate.json'),
    calendarUrlsByInstanceGradeRange = {},
    eventsByCalendarUrl = {},
    daysOffByInstanceGradeRange = {},
    daysOffByCalendarUrl = {},
    code = require('fs').readFileSync(__dirname + '/../../lib/timing.js').toString();

(slateConfig.instances || []).forEach(function(instance) {
    var daysOff = instance.daysOff;

    if (daysOff) {
        calendarUrlsByInstanceGradeRange[instance.key] = {};

        for (var gradeRange in daysOff) {
            let url = daysOff[gradeRange];
            eventsByCalendarUrl[url] = null;
            calendarUrlsByInstanceGradeRange[instance.key][gradeRange] = url;
        }
    }
});

function getIcalThunk(url) {
    return function(callback) {
        ical.fromURL(url, {}, function(err, data) {
            callback(err, data);
        });
    };
}

function eventsToDaysOff(events) {
    var daysOff = {};

    for (var eventId in events) {
        let event = events[eventId];
        event.start = timing.stripTime(event.start);
        event.end = timing.stripTime(event.end);

        if (event.start !== event.end) {
            // Multi day event
            timing.getDatesBetween(event.start, event.end).forEach(day => daysOff[day.toDateString()] = 1);
        } else {
            daysOff[day.toDateString()] = 1;
        }
    }

    return daysOff;
}

function* refreshInstanceCalendars(instance) {
    var instanceCalendarUrls = calendarUrlsByInstanceGradeRange[instance];

    daysOffByInstanceGradeRange[instance] || (daysOffByInstanceGradeRange[instance] = {});

    for (var gradeRange in instanceCalendarUrls) {
        let url = instanceCalendarUrls[gradeRange];
        eventsByCalendarUrl[url] = (yield getIcalThunk(url));
        daysOffByCalendarUrl[url] = eventsToDaysOff(eventsByCalendarUrl[url]);
        daysOffByInstanceGradeRange[instance][gradeRange] = daysOffByCalendarUrl[url];
    }

    return daysOffByInstanceGradeRange[instance];
}

function *getHandler() {
    var ctx = this,
        calendars = daysOffByInstanceGradeRange[ctx.schema] || (yield refreshInstanceCalendars(ctx.schema)),
        gradeRangeToArray = require('../../lib/util')
            .gradeRangeToArray
            .toString(),
        daysOffByGrade = `unpackGradeRanges(${JSON.stringify(calendars)})`;

    ctx.type = 'application/javascript';

    ctx.body = code
        .replace("require('./util').gradeRangeToArray", gradeRangeToArray)
        .replace('daysOffByGrade: {}', `daysOffByGrade: ${daysOffByGrade}`);
}

module.exports = {
    get: getHandler
};
