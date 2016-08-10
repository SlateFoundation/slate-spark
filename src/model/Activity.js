/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.Activity', {
    extend: 'SparkClassroom.model.StudentSparkpoint',
    requires: [
        'Slate.proxy.API'
    ],
    fields: [
        'section_id',
        'section_code',
        {
            name: 'completed_phase_numerical',
            depends: [
                'learn_finish_time',
                'learn_override_time',
                'conference_finish_time',
                'conference_override_time',
                'apply_finish_time',
                'apply_override_time',
                'assess_finish_time',
                'assess_override_time'
            ],
            persist: false,
            calculate: function(data) {
                if (data.assess_finish_time || data.assess_override_time) {
                    return 4;
                } else if (data.apply_finish_time || data.apply_override_time) {
                    return 3;
                } else if (data.conference_finish_time || data.conference_override_time) {
                    return 2;
                } else if (data.learn_finish_time || data.learn_override_time) {
                    return 1;
                } else {
                    return 0;
                }
            }
        },

        {
            name: 'student_sparkpointid',
            depends: ['student_id', 'sparkpoint_id'],
            critical: true,
            calculate: function(data) {
                return data.student_id + '_' + data.sparkpoint_id;
            }
        },

        {
            name: 'learn_completed_time',
            depends: [
                'learn_finish_time',
                'learn_override_time'
            ],
            persist: false,
            calculate: function(data) {
                return data.learn_finish_time || data.learn_override_time || null
            }
        },

        {
            name: 'conference_completed_time',
            depends: [
                'conference_finish_time',
                'conference_override_time'
            ],
            persist: false,
            calculate: function(data) {
                return data.conference_finish_time || data.conference_override_time || null
            }
        },

        {
            name: 'apply_completed_time',
            depends: [
                'apply_finish_time',
                'apply_override_time'
            ],
            persist: false,
            calculate: function(data) {
                return data.apply_finish_time || data.apply_override_time || null
            }
        },

        {
            name: 'assess_completed_time',
            depends: [
                'assess_finish_time',
                'assess_override_time'
            ],
            persist: false,
            calculate: function(data) {
                return data.assess_finish_time || data.assess_override_time || null
            }
        }
    ],

    proxy: {
        type: 'slate-api',
        url: '/spark/api/work/activity',
        idProperty: 'student_sparkpointid',
        extraParams: {
            status: 'all'
        }
    }
});