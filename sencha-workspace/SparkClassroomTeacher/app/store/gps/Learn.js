Ext.define('SparkClassroomTeacher.store.gps.Learn', {
    extend: 'Ext.data.ChainedStore',


    config: {
        source: 'StudentSparkpoints',
        filters: [{
            filterFn: function(r) {
                var activeSparkpoints = Ext.getStore('StudentSparkpoints').queryBy(function(record) {
                    return record.get('student_id') == r.get('student_id')
                }, this).getRange(),
                    i = 0,
                    len = activeSparkpoints.length;

                // first filter out records that aren't in this phase
                if (r.get('active_phase') !== 'learn') {
                    return false;
                }

                // now we only want to keep the current (most recently accessed) sparkpoint for each student
                for (i; i < len; i++) {
                    if (activeSparkpoints[i].get('last_accessed') > r.get('last_accessed')) {
                        return false;
                    }
                }

                return true;
            }
        }],
        grouper: {
            groupFn: function(r) {
                if (!r.get('learn_start_time')) {
                    return 'Not Started';
                }

                return 'Working';
            },
            sorterFn: function(r1, r2) {
                var learnStart1 = r1.get('learn_start_time'),
                    learnStart2 = r2.get('learn_start_time');

                // not started first
                if (learnStart1 && !learnStart2) {
                    return 1;
                } else if (!learnStart1 && learnStart2) {
                    return -1;
                }

                // working last
                return 0;
            }
        },
        sorters: [{
            property: 'learn_subphase_duration'
        }]
    }
});