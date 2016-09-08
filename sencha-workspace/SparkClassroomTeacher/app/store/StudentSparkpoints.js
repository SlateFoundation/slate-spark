Ext.define('SparkClassroomTeacher.store.StudentSparkpoints', {
    extend: 'Ext.data.Store',


    // TODO: use autoSync and eliminate manual calls to record.save() everywhere?
    model: 'SparkClassroom.model.StudentSparkpoint',

    proxy: {
        type: 'spark-studentsparkpoints',
        url: '/spark/api/work/activity',
        extraParams: {
            status: 'all'
        }
    },

    config: {
        // filter out activity that didn't match a student in the active roster
        filters: [{
            filterFn: function(r) {
                return r.get('student');
            }
        }]
    },

    loadUpdates: function() {
        var me = this;

        me.createOperation('read', {
            callback: function(incomingRecords) {
                var existingIds = me.collect('student_sparkpointid'),
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
                    me.remove(me.getById(existingIds[i]));
                }


                me.endUpdate();
            }
        }).execute();
    }
});