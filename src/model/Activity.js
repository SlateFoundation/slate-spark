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
            name: 'completed_phase_number',
            persist: false,
            calculate: function(data) {
                if (data.assess_finish_time || data.assess_override_time) {
                    return 4;
                }
                if (data.apply_finish_time || data.apply_override_time) {
                    return 3;
                }
                if (data.conference_finish_time || data.conference_override_time) {
                    return 2;
                }
                if (data.learn_finish_time || data.learn_override_time) {
                    return 1;
                }

                return 0;
            }
        },

        {
            name: 'student_sparkpointid',
            depends: ['student_id', 'sparkpoint_id'],
            calculate: function(data) {
                return data.student_id + '_' + data.sparkpoint_id;
            }
        },

        {
            name: 'learn_completed_time',
            persist: false,
            calculate: function(data) {
                return data.learn_finish_time || data.learn_override_time || null
            }
        },

        {
            name: 'conference_completed_time',
            persist: false,
            calculate: function(data) {
                return data.conference_finish_time || data.conference_override_time || null
            }
        },

        {
            name: 'apply_completed_time',
            persist: false,
            calculate: function(data) {
                return data.apply_finish_time || data.apply_override_time || null
            }
        },

        {
            name: 'assess_completed_time',
            persist: false,
            calculate: function(data) {
                return data.assess_finish_time || data.assess_override_time || null
            }
        }
    ],
    proxy: {
        type: 'slate-api',
        url: '/spark/api/work/activity',
        batchActions: false,
        extraParams: {
            status: 'all'
        },
        writer: {
            type: 'json',
            allowSingle: true
        }
    }
});