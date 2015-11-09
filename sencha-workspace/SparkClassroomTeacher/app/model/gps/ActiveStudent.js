/* global SparkClassroom */
/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.model.gps.ActiveStudent', {
    extend: 'SparkClassroom.model.StudentSparkpoint',
    requires: [
        'SparkClassroom.model.work.MasteryCheckScore'
    ],


    idProperty: 'student_id',
    fields: [
        {
            name: 'student',
            depends: ['student_id'],
            mapping: 'student_id',
            convert: function(v, r) {
                return Ext.getStore('Students').getById(v);
            }
        },

        {
            name: 'student_name',
            depends: ['student'],
            convert: function(v, r) {
                var student = r.get('student');
                return student ? student.get('FullName') : '[Unenrolled Student]';
            }
        },

        {
            name: 'learn_score_record',
            defaultValue: null
        },
        {
            name: 'learn_score',
            depends: ['learn_score_record'],
            convert: function(v, r) {
                var record = r.get('learn_score_record');

                return record ? record.get('score') : record;
            }
        },

        {
            name: 'priority_group',
            type: 'int',
            allowNull: true,

            // TODO: remove this when backend is implemented
            persist: false,
            convert: function(v, r) {
                var priorityGroups = r.self.priorityGroups = r.self.priorityGroups || {},
                    userId = r.get('student_id');

                // temporarily persist value in model instance until backend is implemented
                if (v === undefined) {
                    v = priorityGroups[userId];
                } else {
                    priorityGroups[userId] = v;
                }

                return v || null;
            }
        },
        {
            name: 'help_request',
            allowNull: true,

            // TODO: remove this when backend is implemented
            persist: false,
            convert: function(v, r) {
                var types = ['question-general','question-academic','question-technology','bathroom','locker','nurse'],
                    helpRequests = r.self.helpRequests = r.self.helpRequests || {},
                    userId = r.get('student_id');

                // temporarily persist value in model instance until backend is implemented
                if (userId in helpRequests) {
                    if (v === undefined) {
                        v = helpRequests[userId];
                    } else {
                        helpRequests[userId] = v;
                    }
                } else {
                    //helpRequests[userId] = v = Math.random() < 0.8 ? null : types[Math.floor(Math.random()*types.length)];
                }

                return v || null;
            }
        },
        {
            name: 'help_request_abbr',
            convert: function (v, r) {
                switch(r.get('help_request')) {
                    case 'question-general':
                        return 'G?';
                    case 'question-academic':
                        return 'A?';
                    case 'question-technology':
                        return 'T?';
                    case 'nurse':
                        return 'N';
                    case 'bathroom':
                        return 'B';
                    case 'locker':
                        return 'L';
                }
            }
        },
        {
            name: 'conference_group',
            type: 'int',
            allowNull: true,

            // TODO: remove this when backend is implemented
            persist: false,
            convert: function(v, r) {
                var conferenceGroups = r.self.conferenceGroups = r.self.conferenceGroups || {},
                    userId = r.get('student_id');

                // temporarily persist value in model instance until backend is implemented
                if (v === undefined) {
                    v = conferenceGroups[userId];
                } else {
                    conferenceGroups[userId] = v;
                }

                return v || null;
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

    loadMasteryCheckScore: function(phase, callback, scope) {
        var me = this,
            recordProperty = phase + '_score_record',
            record = me.get(recordProperty);

        if (record) {
            Ext.callback(callback, scope, [record]);
            return;
        }

        SparkClassroom.model.work.MasteryCheckScore.load(null, {
            params: {
                student_id: me.getId(),
                sparkpoint: me.get('sparkpoint')
            },
            callback: function(record, operation, success) {
                if (!success) {
                    record = false;
                }

                me.set(recordProperty, record, { dirty: false });
                Ext.callback(callback, scope, [record]);
            }
        });
    },

    saveMasteryCheckScore: function(phase, score) {
        var me = this,
            recordProperty = phase + '_score_record',
            record = me.get(recordProperty);

        if (record) {
            record.set('score', score);
            me.set(phase + '_score'); // force calculated field to refresh
        } else {
            record = new SparkClassroom.model.work.MasteryCheckScore({
                student_id: me.getId(),
                sparkpoint: me.get('sparkpoint'),
                phase: phase,
                score: score
            });
            me.set(recordProperty, record);
        }

        record.save();
    }
});