/* global SparkClassroom */
/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.model.gps.ActiveStudent', {
    extend: 'SparkClassroom.model.StudentSparkpoint',
    requires: [
        'SparkClassroom.proxy.StudentSparkpoints'
    ],

    // TODO: move this id property up to parent class
    idProperty: 'student_sparkpoint',
    fields: [
        {
            name: 'student_sparkpoint',
            persist: false
        },

        {
            name: 'student',
            persist: false,
            mapping: 'student_id',
            depends: ['student_id'],
            convert: function(v, r) {
                return Ext.getStore('Students').getById(v);
            }
        },

        {
            name: 'student_name',
            persist: false,
            depends: ['student'],
            convert: function(v, r) {
                var student = r.get('student');
                return student ? student.get('FullName') : '[Unenrolled Student]';
            }
        },

        {
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
        },

        {
            name: 'priority_date',
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
                var conferenceStartTime = r.get('conference_start_time'),
                    conferenceJoinTime = r.get('conference_join_time'),
                    applyReadyTime = r.get('apply_ready_time'),
                    assessReadyTime = r.get('assess_ready_time');

                if (conferenceStartTime && !conferenceJoinTime) {
                    return conferenceStartTime;
                }

                if (conferenceJoinTime && !r.get('conference_finish_time')) {
                    return conferenceJoinTime;
                }

                if (applyReadyTime && !r.get('apply_finish_time')) {
                    return applyReadyTime;
                }

                if (assessReadyTime && !r.get('assess_finish_time')) {
                    return assessReadyTime;
                }

                return null;
            }
        },

        {
            name: 'conference_feedback',
            persist: false,
            convert: function(v) {
                return v || [];
            }
        },
        {
            name: 'conference_feedback_count',
            persist: false,
            depends: ['conference_feedback'],
            convert: function(v, r) {
                return r.get('conference_feedback').length;
            }
        }
    ],

    proxy: {
        type: 'spark-studentsparkpoints',
        url: '/spark/api/work/activity'
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