Ext.define('SparkClassroomTeacher.store.gps.Learn', {
    extend: 'Ext.data.ChainedStore',


    config: {
        source: 'StudentSparkpoints',
        filters: [{
            filterFn: function(r) {
                // filter out records that aren't in this phase
                return r.get('active_phase') !== 'learn';
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