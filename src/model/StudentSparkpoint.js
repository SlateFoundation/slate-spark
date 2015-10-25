/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.StudentSparkpoint', {
    extend: 'Ext.data.Model',


    fields: [
        // composite key
        {
            name: 'student_id',
            type: 'int',
            critical: true
        },
        {
            name: 'sparkpoint_id',
            type: 'string',
            critical: true
        },

        // learning cycle milestone timestamps
        {
            name: 'learn_start_time',
            type: 'date',
            allowNull: true
        },{
            name: 'learn_finish_time',
            type: 'date',
            allowNull: true
        },{
            name: 'conference_start_time',
            type: 'date',
            allowNull: true
        },{
            name: 'conference_join_time',
            type: 'date',
            allowNull: true
        },{
            name: 'conference_finish_time',
            type: 'date',
            allowNull: true
        },{
            name: 'apply_start_time',
            type: 'date',
            allowNull: true
        },{
            name: 'apply_ready_time',
            type: 'date',
            allowNull: true
        },{
            name: 'apply_finish_time',
            type: 'date',
            allowNull: true
        },{
            name: 'assess_start_time',
            type: 'date',
            allowNull: true
        },{
            name: 'assess_ready_time',
            type: 'date',
            allowNull: true
        },{
            name: 'assess_finish_time',
            type: 'date',
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
                if (r.get('assess_finish_time')) {
                    return null;
                }

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
    ]
});