/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.StudentSparkpoint', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.proxy.API',
        'SparkClassroom.data.field.SparkDate'
    ],


    idProperty: 'sparkpoint',
    fields: [
        {
            name: 'sparkpoint',
            type: 'string'
        },
        {
            name: 'section',
            type: 'string'
        },
        {
            name: 'student_id',
            type: 'int',
            allowNull: true,
            persist: false
        },
        {
            name: 'sparkpoint_id',
            type: 'string',
            allowNull: true,
            persist: false
        },

        // learning cycle milestone timestamps
        {
            name: 'learn_start_time',
            type: 'sparkdate',
            allowNull: true
        },{
            name: 'learn_finish_time',
            type: 'sparkdate',
            allowNull: true
        },{
            name: 'conference_start_time',
            type: 'sparkdate',
            allowNull: true
        },{
            name: 'conference_join_time',
            type: 'sparkdate',
            allowNull: true
        },{
            name: 'conference_finish_time',
            type: 'sparkdate',
            allowNull: true
        },{
            name: 'apply_start_time',
            type: 'sparkdate',
            allowNull: true
        },{
            name: 'apply_ready_time',
            type: 'sparkdate',
            allowNull: true
        },{
            name: 'apply_finish_time',
            type: 'sparkdate',
            allowNull: true
        },{
            name: 'assess_start_time',
            type: 'sparkdate',
            allowNull: true
        },{
            name: 'assess_ready_time',
            type: 'sparkdate',
            allowNull: true
        },{
            name: 'assess_finish_time',
            type: 'sparkdate',
            allowNull: true
        },

        // locally calculated fields
        {
            name: 'active_phase',
            persist: false,
            depends: [
                'learn_finish_time',
                'conference_finish_time',
                'apply_finish_time',
                'assess_finish_time'
            ],
            convert: function(v, r) {
                if (r.get('apply_finish_time')) {
                    return 'assess';
                }

                if (r.get('conference_finish_time')) {
                    return 'apply';
                }

                if (r.get('learn_finish_time')) {
                    return 'conference';
                }

                return 'learn';
            }
        }
    ],

    proxy: {
        type: 'slate-api',
        url: '/spark/api/work/activity',

        writer: {
            type: 'json',
            allowSingle: true
        }
    }
});