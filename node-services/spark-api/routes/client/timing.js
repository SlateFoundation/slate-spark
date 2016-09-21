'use strict';

var ical = require('ical'),
    timing = require('../../lib/timing'),
    defer = require('co-defer'),
    gradeRangeToArray = require('../../lib/util').gradeRangeToArray,

    // Get shared code as strings for code generation
    gradeRangeToArrayCode = require('../../lib/util')
        .gradeRangeToArray
        .toString(),
    code = require('fs')
        .readFileSync(__dirname + '/../../lib/timing.js')
        .toString()
        .replace("require('./util').gradeRangeToArray", gradeRangeToArrayCode),

    slateConfig = require('../../config/slate.json'),

    // Keyed by grade range
    calendarUrlsByInstanceGradeRange = {},
    daysOffByInstanceGradeRange = {},

    // Keyed by calendar URL
    eventsByCalendarUrl = {},
    daysOffByCalendarUrl = {},

    // Keyed by instance
    expirationByInstanceKey = {},

    refreshInterval = 300 * 1000 /* 5 Minutes*/;

(slateConfig.instances || []).forEach(function(instance) {
    var daysOff = instance.daysOff,
        instanceKey = instance.key;

    if (daysOff) {
        calendarUrlsByInstanceGradeRange[instanceKey] = {};

        for (var gradeRange in daysOff) {
            let url = daysOff[gradeRange];
            eventsByCalendarUrl[url] = null;
            calendarUrlsByInstanceGradeRange[instanceKey][gradeRange] = url;
        }
    } else {
        console.warn(`WARNING: Missing daysOff calendar url for: ${instanceKey}`);
    }

    defer.setInterval(getInstanceCalendars(instanceKey), refreshInterval);
    defer.setImmediate(getInstanceCalendars(instanceKey));
});

// Returns a "thunk" for the callback-based ical module
function getIcalThunk(url) {
    return function(callback) {
        ical.fromURL(url, {}, function(err, data) {
            callback(err, data);
        });
    };
}

// Convert ical events into an object keyed by .toDateString() with a truthy value of 1 to indicate the key is a day off
function eventsToDaysOff(events) {
    var daysOff = {};

    for (var eventId in events) {
        let event = events[eventId];

        // This handles timezone events and daylight savings time weirdness (events without end dates)
        if (event.type === 'VTIMEZONE' || !event.end || !event.start) continue;

        event.start = timing.stripTime(event.start);
        event.end = timing.stripTime(event.end);

        if (event.start !== event.end) {
            // Multi day event
            let dates = timing.getDatesBetween(event.start, event.end);
            dates.forEach(day => daysOff[day.toDateString()] = 1);
        } else {
            daysOff[day.toDateString()] = 1;
        }
    }

    return daysOff;
}

// Refreshes all calendars associated with a slate instance
function* getInstanceCalendars(instanceKey) {
    console.log(`Timing: Updating google calendars for: ${instanceKey}`);

    var instanceCalendarUrls = calendarUrlsByInstanceGradeRange[instanceKey];

    daysOffByInstanceGradeRange[instanceKey] || (daysOffByInstanceGradeRange[instanceKey] = {});

    for (var gradeRange in instanceCalendarUrls) {
        let url = instanceCalendarUrls[gradeRange];
        eventsByCalendarUrl[url] = (yield getIcalThunk(url));
        daysOffByCalendarUrl[url] = eventsToDaysOff(eventsByCalendarUrl[url]);
        daysOffByInstanceGradeRange[instanceKey][gradeRange] = daysOffByCalendarUrl[url];
    }

    expirationByInstanceKey[instanceKey] = new Date().getTime() + refreshInterval;

    return daysOffByInstanceGradeRange[instanceKey];
}

function *getHandler() {
    var ctx = this,
        instanceKey = ctx.schema,
        calendars = daysOffByInstanceGradeRange[instanceKey] || (yield getInstanceCalendars(instanceKey)),
        daysOffByGrade = `unpackGradeRanges(${JSON.stringify(calendars)})`,
        clientCode = code.replace('daysOffByGrade: {}', `daysOffByGrade: ${daysOffByGrade}`),
        maxAgeInMs = expirationByInstanceKey[instanceKey] - new Date().getTime();

    ctx.type = 'application/javascript';
    ctx.set('Cache-control', 'private, max-age=' + (maxAgeInMs ? Math.floor((maxAgeInMs / 1000)) : 0));

    // For development environments only
    if (!(instanceKey.endsWith('-staging') || instanceKey.endsWith('-live'))) {
        clientCode = clientCode.replace(
            'throw err; // Throw on staging and live; development environments always return 9',
            `console.warn('Falling back to 9th grade for timing:', err); return 9; // Dev environments always return 9`
        );
    }

    ctx.body = clientCode;
}

module.exports = {
    get: getHandler
};
