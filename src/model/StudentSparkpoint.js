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
            type: 'string',
            critical: true
        },
        {
            name: 'section',
            type: 'string'
        },
        {
            name: 'student_id',
            type: 'int',
            allowNull: true,
            critical: true
        },
        {
            name: 'sparkpoint_id',
            type: 'string',
            allowNull: true,
            critical: true
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
            name: 'learn_override_time',
            type: 'sparkdate',
            allowNull: true
        },{
            name: 'learn_override_teacher_id',
            type: 'int',
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
            name: 'conference_override_time',
            type: 'sparkdate',
            allowNull: true
        },{
            name: 'conference_override_teacher_id',
            type: 'int',
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
            name: 'apply_override_time',
            type: 'sparkdate',
            allowNull: true
        },{
            name: 'apply_override_teacher_id',
            type: 'int',
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
        },{
            name: 'assess_override_time',
            type: 'sparkdate',
            allowNull: true
        },{
            name: 'assess_override_teacher_id',
            type: 'int',
            allowNull: true
        },

        // other persistent student+sparkpoint state
        {
            name: 'last_accessed',
            type: 'sparkdate',
            allowNull: true
        },
        {
            name: 'conference_group_id',
            type: 'int',
            allowNull: true
        },
        {
            name: 'learn_mastery_check_score',
            type: 'int',
            allowNull: true
        },
        {
            name: 'conference_mastery_check_score',
            type: 'int',
            allowNull: true
        },
        {
            name: 'override_reason',
            type: 'string',
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
        },
        {
            name: 'learn_subphase_duration',
            persist: false,
            depends: [
                'learn_start_time'
            ],
            convert: function(v, r) {
                var learnStartTime = r.get('learn_start_time');

                if (!learnStartTime) {
                    return null;
                }

                return Date.now() - learnStartTime;
            }
        },
        {
            name: 'conference_subphase_duration',
            persist: false,
            depends: [
                'learn_start_time',
                'conference_start_time'
            ],
            convert: function(v, r) {
                var learnFinishTime = r.get('learn_finish_time'),
                    conferenceStartTime = r.get('conference_start_time'),
                    conferenceJoinTime = r.get('conference_join_time');

                if (!learnFinishTime) {
                    return null;
                }

                if (!conferenceStartTime) {
                    return Date.now() - learnFinishTime;
                }

                if (!conferenceJoinTime) {
                    return Date.now() - conferenceStartTime;
                }

                return Date.now() - conferenceJoinTime;
            }
        },
        {
            name: 'apply_subphase_duration',
            persist: false,
            depends: [
                'conference_finish_time'
            ],
            convert: function(v, r) {
                var conferenceFinishTime = r.get('conference_finish_time'),
                    applyStartTime = r.get('apply_start_time'),
                    applyReadyTime = r.get('apply_ready_time');

                if (!conferenceFinishTime) {
                    return null;
                }

                if (!applyStartTime) {
                    return Date.now() - conferenceFinishTime;
                }

                if (!applyReadyTime) {
                    return Date.now() - Math.max(conferenceFinishTime, applyStartTime);
                }

                return Date.now() - applyReadyTime;
            }
        },
        {
            name: 'assess_subphase_duration',
            persist: false,
            depends: [
                'apply_finish_time',
                'assess_start_time'
            ],
            convert: function(v, r) {
                var applyFinishTime = r.get('apply_finish_time'),
                    assessStartTime = r.get('assess_start_time'),
                    assessReadyTime = r.get('assess_ready_time'),
                    assessFinishTime = r.get('assess_finish_time');

                if (!applyFinishTime) {
                    return null;
                }

                if (!assessStartTime) {
                    return Date.now() - applyFinishTime;
                }

                if (!assessReadyTime) {
                    return Date.now() - assessStartTime;
                }

                if (!assessFinishTime) {
                    return Date.now() - assessReadyTime;
                }

                return Date.now() - assessFinishTime;
            }
        },
        {
            name: 'total_duration',
            persist: false,
            depends: [
                'learn_start_time'
            ],
            convert: function(v, r) {
                var learnStartTime = r.get('learn_start_time');

                if (!learnStartTime) {
                    return null;
                }

                return Date.now() - learnStartTime;
            }
        }
    ]
});