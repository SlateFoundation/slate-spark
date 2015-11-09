/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.gps.Apply', {
    extend: 'Ext.data.ChainedStore',


    config: {
        source: 'gps.ActiveStudents',
        filters: [{
            property: 'active_phase',
            value: 'apply'
        }],
        grouper: {
            groupFn: function(r) {
                if (!r.get('apply_start_time')) {
                    return 'Not Started';
                }

                if (!r.get('apply_ready_time')) {
                    return 'Working';
                }

                return 'Ready for Grading';
            },
            sorterFn: function(r1, r2) {
                var applyStart1 = r1.get('apply_start_time'),
                    applyStart2 = r2.get('apply_start_time'),
                    applyReady1 = r1.get('apply_ready_time'),
                    applyReady2 = r2.get('apply_ready_time');

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

                // waiting for grading last
                return 0;
            }
        },
        sorters: [{
            property: 'apply_subphase_duration'
        }]
    }
});