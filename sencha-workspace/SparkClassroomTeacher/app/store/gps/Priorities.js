/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.gps.Priorities', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.proxy.API'
    ],


    config: {
        proxy: {
            type: 'slate-api',
            url: '/spark/api/work/blocked'
        },

        // filter out activity that didn't match a student in the active roster
        // filters: [{
        //     filterFn: function(r) {
        //         return r.get('student');
        //     }
        // }],

        grouper: {
            groupFn: function(r) {
                if (r.get('conference_start_time') && !r.get('conference_join_time')) {
                    return 'Conference Join';
                } else if (r.get('conference_join_time') && !r.get('conference_finish_time')) {
                    return 'Conference Finish';
                } else if (r.get('apply_ready_time') && !r.get('apply_finish_time')) {
                    return 'Apply Grade';
                } else if (r.get('assess_ready_time') && !r.get('assess_finish_time')) {
                    return 'Assess Grade';
                }

                return 'Blocked';
            },
            sorterFn: function(r1, r2) {
                var conferenceStart = r1.get('conference_start_time'),
                    conferenceJoin = r2.get('conference_join_time'),
                    conferenceFinish = r2.get('conference_finish_time'),
                    applyReady = r2.get('apply_ready_time'),
                    applyFinish = r2.get('apply_finish_time'),
                    assessReady = r2.get('assess_ready_time'),
                    assessFinish = r2.get('assess_finish_time');

                // conference not joined first
                if (conferenceStart && !conferenceJoin) {
                    return 4;
                } else if (conferenceJoin && !conferenceFinish) {
                    return 3;
                } else if (applyReady && !applyFinish) {
                    return 2;
                } else if (assessReady && !assessFinish) {
                    return 1;
                }

                // default
                return 0;
            }
        },
    },
/*
    loadUpdates: function() {
        var me = this;

        me.createOperation('read', {
            callback: function(incomingRecords) {
                var existingIds = me.collect('student_id'),
                    i, len,
                    id, existingRecord, incomingRecord,
                    newRecords = [];


                me.beginUpdate();


                // update existing records and build array of new records
                for (i = 0, len = incomingRecords.length; i < len; i++) {
                    incomingRecord = incomingRecords[i];
                    id = incomingRecord.getId();
                    existingRecord = me.getById(id);

                    if (id) {
                        Ext.Array.remove(existingIds, id);
                    }

                    if (existingRecord) {
                        existingRecord.set(incomingRecord.getData({persist: true}), {
                            dirty: false,
                            convert: false
                        });
                    } else {
                        newRecords.push(incomingRecord);
                    }
                }


                // add new records all together
                me.add(newRecords);


                // remove missing skills from same demonstration
                for (i = 0, len = existingIds.length; i < len; i++) {
                    me.remove(existingIds[i]);
                }


                me.endUpdate();
            }
        }).execute();
    }
*/
});