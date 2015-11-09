/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.gps.Conference', {
    extend: 'Ext.data.ChainedStore',


    config: {
        source: 'gps.ActiveStudents',
        filters: [{
            property: 'active_phase',
            value: 'conference'
        }],
        grouper: {
            groupFn: function(r) {
                var conferenceGroup = r.get('conference_group');

                if (!r.get('conference_start_time')) {
                    return 'Working';
                }

                if (!r.get('conference_join_time')) {
                    return 'Waiting';
                }

                if (!conferenceGroup) {
                    return 'Left Group';
                }

                return 'Group #' + conferenceGroup;
            },
            sorterFn: function(r1, r2) {
                var conferenceReady1 = r1.get('conference_start_time'),
                    conferenceReady2 = r2.get('conference_start_time'),
                    conferenceJoined1 = r1.get('conference_join_time'),
                    conferenceJoined2 = r2.get('conference_join_time'),
                    conferenceGroup1 = r1.get('conference_group'),
                    conferenceGroup2 = r2.get('conference_group');

                // working first
                if (conferenceReady1 && !conferenceReady2) {
                    return 1;
                } else if (!conferenceReady1 && conferenceReady2) {
                    return -1;
                }

                // waiting second
                if (conferenceJoined1 && !conferenceJoined2) {
                    return 1;
                } else if (!conferenceJoined1 && conferenceJoined2) {
                    return -1;
                }

                // left group
                if (conferenceGroup1 && !conferenceGroup2) {
                    return 1;
                } else if (!conferenceGroup1 && conferenceGroup2) {
                    return -1;
                }

                // group # fourth
                if (conferenceGroup1 > conferenceGroup2) {
                    return 1;
                } else if (conferenceGroup1 < conferenceGroup2) {
                    return -1;
                }

                // members in same group
                return 0;
            }
        },
        sorters: [{
            property: 'conference_subphase_duration'
        }]
    }
});