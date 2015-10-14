/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.gps.Conference', {
    extend: 'Ext.data.ChainedStore',


    config: {
        source: 'gps.ActiveStudents',
        filters: [{
            property: 'phase',
            value: 'conference'
        }],
        grouper: {
            groupFn: function(r) {
                var conferenceGroup = r.get('conference_group');

                if (!r.get('conference_ready')) {
                    return 'Working';
                }

                if (!conferenceGroup) {
                    return 'Waiting';
                }

                return 'Group #' + conferenceGroup;
            },
            sorterFn: function(r1, r2) {
                var conferenceReady1 = r1.get('conference_ready'),
                    conferenceReady2 = r2.get('conference_ready'),
                    conferenceGroup1 = r1.get('conference_group'),
                    conferenceGroup2 = r2.get('conference_group'),
                    conferenceDuration1 = r1.get('conference_duration'),
                    conferenceDuration2 = r2.get('conference_duration');

                // working first
                if (conferenceReady1 && !conferenceReady2) {
                    return 1;
                } else if (!conferenceReady1 && conferenceReady2) {
                    return -1;
                }

                // waiting second
                if (conferenceGroup1 && !conferenceGroup2) {
                    return 1;
                } else if (!conferenceGroup1 && conferenceGroup2) {
                    return -1;
                }

                // group # 3rd
                if (conferenceGroup1 > conferenceGroup2) {
                    return 1;
                } else if (conferenceGroup1 < conferenceGroup2) {
                    return -1;
                }

                // finally sort by phase duration
                return conferenceDuration1 > conferenceDuration2 ? 1 : (conferenceDuration1 === conferenceDuration2) ? 0 : -1;
            }
        }
    }
});