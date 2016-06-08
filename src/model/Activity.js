/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.Activity', {
    extend: 'Ext.data.Model',
    // extend: 'SparkClassroom.model.StudentSparkpoint',
    requires: [
        'Slate.proxy.API'
    ],

    idProperty: 'student_sparkpointid',

    fields: [
        'section_id',
        'section_code',

        'sparkpoint_id',
        'student_id',

        'learn_finish_time',
        'conference_finish_time',
        'apply_finish_time',
        'assess_finish_time',

        {
            name: 'completed_phase_numerical',
            depends: [
                'learn_finish_time',
                'conference_finish_time',
                'apply_finish_time',
                'assess_finish_time'
            ],
            persist: false,
            calculate: function(data) {
                if (data.assess_finish_time) {
                    return 4;
                } else if (data.apply_finish_time) {
                    return 3;
                } else if (data.conference_finish_time) {
                    return 2;
                } else if (data.learn_finish_time) {
                    return 1;
                } else {
                    return 0;
                }
            }
        },

        {
            name: 'student_sparkpointid',
            depends: ['student_id', 'sparkpoint_id'],
            persist: false,
            crtical: true,
            calculate: function(data) {
                return data.student_id + '_' + data.sparkpoint_id;
            }
        }
    ],

    proxy: {
        type: 'slate-api',
        url: '/spark/api/work/activity',

        extraParams: {
            status: 'all'
        }
    }
});