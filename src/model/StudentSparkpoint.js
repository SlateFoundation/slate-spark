/* global Ext */
Ext.define('SparkClassroom.model.StudentSparkpoint', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.proxy.API',
        'SparkClassroom.data.field.SparkDate'
    ],


    idProperty: 'sparkpoint',
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
                if (data.learn_completed_time) {
                    return 1;
                }

                return 0;
            }
        }, {
            name: 'student_sparkpointid',
            calculate: function(data) {
                return data.student_id + '_' + data.sparkpoint_id;
            }
        }, {
            name: 'student',
            persist: false,
            mapping: 'student_id',
            depends: ['student_id'],
            convert: function(v) {
                return Ext.getStore('Students').getById(v);
            }
        }, {
            name: 'student_name',
            persist: false,
            depends: ['student'],
            convert: function(v, r) {
                var student = r.get('student');

                return student ? student.get('FullName') : '[Unenrolled Student]';
            }
        }, {
            name: 'priority_need',
            persist: false,
            depends: [
                'conference_start_time',
                'conference_join_time',
                'conference_finish_time',
                'apply_ready_time',
                'apply_finish_time',
                'assess_ready_time',
                'assess_finish_time'
            ],
            convert: function(v, r) {
                var conferenceJoinTime = r.get('conference_join_time');

                if (r.get('conference_start_time') && !conferenceJoinTime) {
                    return 'conference-group';
                }

                if (conferenceJoinTime && !r.get('conference_finish_time')) {
                    return 'conference-finish';
                }

                if (r.get('apply_ready_time') && !r.get('apply_finish_time')) {
                    return 'apply-grade';
                }

                if (r.get('assess_ready_time') && !r.get('assess_finish_time')) {
                    return 'assess-grade';
                }

                return null;
            }
        }, {
            name: 'subphase_duration',
            persist: false,
            depends: [
                'active_phase',
                'learn_subphase_duration',
                'conference_subphase_duration',
                'apply_subphase_duration',
                'assess_subphase_duration'
            ],
            convert: function(v, r) {
                switch (r.get('active_phase')) {
                    case 'learn':
                        return r.get('learn_subphase_duration');
                    case 'conference':
                        return r.get('conference_subphase_duration');
                    case 'apply':
                        return r.get('apply_subphase_duration');
                    case 'assess':
                        return r.get('assess_subphase_duration');
                    default:
                        return null;
                }
            }
        }, {
            name: 'conference_feedback',
            persist: false,
            convert: function(v) {
                return v || [];
            }
        }, {
            name: 'conference_feedback_count',
            persist: false,
            depends: ['conference_feedback'],
            convert: function(v, r) {
                return r.get('conference_feedback').length;
            }
        }, {
            name: 'sparkpoint',
            type: 'string',
            critical: true
        }, {
            name: 'section',
            type: 'string'
        }, {
            name: 'student_id',
            type: 'int',
            allowNull: true,
            critical: true
        }, {
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
        }, {
            name: 'learn_finish_time',
            type: 'sparkdate',
            allowNull: true
        }, {
            name: 'learn_override_time',
            type: 'sparkdate',
            allowNull: true
        }, {
            name: 'learn_override_teacher_id',
            type: 'int',
            allowNull: true
        }, {
            name: 'learn_pace_target',
            type: 'int',
            allowNull: true
        }, {
            name: 'conference_start_time',
            type: 'sparkdate',
            allowNull: true
        }, {
            name: 'conference_join_time',
            type: 'sparkdate',
            allowNull: true
        }, {
            name: 'conference_finish_time',
            type: 'sparkdate',
            allowNull: true
        }, {
            name: 'conference_override_time',
            type: 'sparkdate',
            allowNull: true
        }, {
            name: 'conference_override_teacher_id',
            type: 'int',
            allowNull: true
        }, {
            name: 'conference_pace_target',
            type: 'int',
            allowNull: true
        }, {
            name: 'apply_start_time',
            type: 'sparkdate',
            allowNull: true
        }, {
            name: 'apply_ready_time',
            type: 'sparkdate',
            allowNull: true
        }, {
            name: 'apply_finish_time',
            type: 'sparkdate',
            allowNull: true
        }, {
            name: 'apply_override_time',
            type: 'sparkdate',
            allowNull: true
        }, {
            name: 'apply_override_teacher_id',
            type: 'int',
            allowNull: true
        }, {
            name: 'apply_pace_target',
            type: 'int',
            allowNull: true
        }, {
            name: 'assess_start_time',
            type: 'sparkdate',
            allowNull: true
        }, {
            name: 'assess_ready_time',
            type: 'sparkdate',
            allowNull: true
        }, {
            name: 'assess_finish_time',
            type: 'sparkdate',
            allowNull: true
        }, {
            name: 'assess_override_time',
            type: 'sparkdate',
            allowNull: true
        }, {
            name: 'assess_override_teacher_id',
            type: 'int',
            allowNull: true
        }, {
            name: 'assess_pace_target',
            type: 'int',
            allowNull: true
        },

        // other persistent student+sparkpoint state
        {
            name: 'last_accessed',
            type: 'sparkdate',
            allowNull: true
        }, {
            name: 'conference_group_id',
            type: 'int',
            allowNull: true
        }, {
            name: 'learn_mastery_check_score',
            type: 'int',
            allowNull: true
        }, {
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
                'learn_completed_time',
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

                if (r.get('learn_completed_time')) {
                    return 'conference';
                }

                return 'learn';
            }
        }, {
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
        }, {
            name: 'conference_subphase_duration',
            persist: false,
            depends: [
                'learn_start_time',
                'conference_start_time'
            ],
            convert: function(v, r) {
                var learnFinishTime = r.get('learn_completed_time'),
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
        }, {
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
        }, {
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
        }, {
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
        }, {
            name: 'last_accesssed',
            type: 'sparkdate'
        }, {
            name: 'recommender_id',
            type: 'int',
            allowNull: true
        }, {
            name: 'recommended',
            mapping: 'recommender_id',
            convert: function(v) {
                return Boolean(v);
            }
        }, {
            name: 'recommended_time',
            type: 'sparkdate',
            allowNull: true
        }, {
            name: 'learn_completed_time',
            persist: false,
            calculate: function(data) {
                return data.learn_override_time || data.learn_finish_time || null
            }
        }, {
            name: 'conference_completed_time',
            persist: false,
            calculate: function(data) {
                return data.conference_finish_time || data.conference_override_time || null
            }
        }, {
            name: 'apply_completed_time',
            persist: false,
            calculate: function(data) {
                return data.apply_finish_time || data.apply_override_time || null
            }
        }, {
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
        writer: {
            type: 'json',
            allowSingle: true
        }
    },

    saveConferenceGroup: function(groupId) {
        var me = this;

        me.beginEdit();

        me.set('conference_group_id', groupId || null);

        if (groupId && !me.get('conference_join_time')) {
            me.set('conference_join_time', new Date());
        }

        me.endEdit();


        if (me.dirty) {
            me.save();
        }
    }
});