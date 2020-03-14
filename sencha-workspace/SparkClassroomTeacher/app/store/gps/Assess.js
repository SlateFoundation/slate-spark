Ext.define('SparkClassroomTeacher.store.gps.Assess', {
    extend: 'Ext.data.ChainedStore',


    config: {
        source: 'StudentSparkpoints',
        filters: [{
            filterFn: function(r) {
                // filter out records that aren't in this phase
                return r.get('active_phase') === 'assess';
            }
        }],
        grouper: {
            groupFn: function(r) {
                if (!r.get('assess_start_time')) {
                    return 'Not Started';
                }

                if (!r.get('assess_ready_time')) {
                    return 'Working';
                }

                if (!r.get('assess_completed_time')) {
                    return 'Ready for Grading';
                }

                return 'Finished';
            },
            sorterFn: function(r1, r2) {
                var applyStart1 = r1.get('assess_start_time'),
                    applyStart2 = r2.get('assess_start_time'),
                    applyReady1 = r1.get('assess_ready_time'),
                    applyReady2 = r2.get('assess_ready_time'),
                    applyFinished1 = r1.get('assess_completed_time'),
                    applyFinished2 = r2.get('assess_completed_time');

                // choosing first
                if (applyStart1 && !applyStart2) {
                    return 1;
                } else if (!applyStart1 && applyStart2) {
                    return -1;
                }

                // working second
                if (applyReady1 && !applyReady2) {
                    return 1;
                } else if (!applyReady1 && applyReady2) {
                    return -1;
                }

                // waiting for grading third
                if (applyFinished1 && !applyFinished2) {
                    return 1;
                } else if (!applyFinished1 && applyFinished2) {
                    return -1;
                }

                // finished last
                return 0;
            }
        },
        sorters: [{
            property: 'assess_subphase_duration'
        }]
    }
});