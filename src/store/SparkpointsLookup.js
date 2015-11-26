/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.SparkpointsLookup', {
    extend: 'Ext.data.Store',
    alias: 'store.spark-sparkpointslookup',
    requires: [
        'Slate.proxy.API',
        'SparkClassroom.model.Sparkpoint'
    ],


    config: {
        model: 'SparkClassroom.model.Sparkpoint',
        proxy: {
            type: 'slate-api',
            url: '/spark/api/sparkpoints/suggested'
        },
        grouper: {
            groupFn: function(r) {
                if (r.get('assess_finish_time')) {
                    return 'Completed Sparkpoints';
                }

                if (r.get('learn_start_time')) {
                    return 'Current';
                }

                // all other results that do include student-personalized data
                return 'Next Up';
            },
            sorterFn: function(r1, r2) {
                var assessFinish1 = r1.get('assess_finish_time'),
                    assessFinish2 = r2.get('assess_finish_time'),
                    current1 = r1.get('learn_start_time') && !assessFinish1,
                    current2 = r2.get('learn_start_time') && !assessFinish2;

                // current first
                if (current1 && !current2) {
                    return -1;
                } else if (!current1 && current2) {
                    return 1;
                }

                // next up second
                if (!assessFinish1 && assessFinish2) {
                    return -1;
                } else if (assessFinish1 && !assessFinish2) {
                    return 1;
                }

                // completed
                return 0;
            }
        },
        sorters: [{
            property: 'recommended_time',
            direction: 'DESC'
        },{
            property: 'last_accessed',
            direction: 'DESC'
        },{
            property: 'code'
        }]
    }
});