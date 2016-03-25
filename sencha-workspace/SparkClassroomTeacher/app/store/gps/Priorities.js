/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.gps.Priorities', {
    extend: 'Ext.data.Store',
    requires: [
        'SparkClassroom.data.field.SparkDate'
    ],


    model: 'SparkClassroomTeacher.model.gps.ActiveStudent',

    config: {
        proxy: {
            type: 'spark-studentsparkpoints',
            url: '/spark/api/work/blocked'
        },

        // filter out activity that didn't match a student in the active roster
        // filters: [{
        //     filterFn: function(r) {
        //         return r.get('student');
        //     }
        // }],

        filters: [
            {
                filterFn: function(r) {
                    return (
                        r.get('priority_need') !== null
                    );
                }
            }
        ],

        grouper: {
            groupFn: function(r) {
                var priorityNeed = r.get('priority_need');

                return priorityNeed && {
                    'conference-group': 'Needs Conference Group',
                    'conference-finish': 'Needs Conference Finished',
                    'apply-grade': 'Needs Apply Graded',
                    'assess-grade': 'Needs Assess Graded'
                }[priorityNeed] || 'Other Issue';
            },
            sorterFn: function(r1, r2) {
                var need1 = r1.get('priority_need'),
                    need2 = r2.get('priority_need');

                // items have same sort position
                if (need1 == need2) {
                    return 0;
                }

                // if either is conference-group, that comes first
                if (need1 == 'conference-group') {
                    return -1;
                } else if (need2 == 'conference-group') {
                    return 1;
                }

                // if either is conference-finish, that comes next
                if (need1 == 'conference-finish') {
                    return -1;
                } else if (need2 == 'conference-finish') {
                    return 1;
                }

                // if either is apply-grade, that comes next
                if (need1 == 'apply-grade') {
                    return -1;
                } else if (need2 == 'apply-grade') {
                    return 1;
                }

                // if either is assess-grade, that comes next
                if (need1 == 'assess-grade') {
                    return -1;
                } else if (need2 == 'assess-grade') {
                    return 1;
                }

                // items aren't different by any criteria that influences sorting, so they have same sort position
                return 0;
            }
        },
    },

    // TODO: this is the same function as in ActiveStudent store
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
});