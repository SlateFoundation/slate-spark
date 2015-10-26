/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.model.gps.ActiveStudent', {
    extend: 'SparkClassroom.model.StudentSparkpoint',

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
                return r.get('student').get('FullName');
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
                    userId = r.get('user_id');

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
                    userId = r.get('user_id');

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
            name: 'conference_ready',
            allowNull: true,

            persist: false,
            convert: function(v, r) {
                var conferenceReadyTimes = r.self.conferenceReadyTimes = r.self.conferenceReadyTimes || {},
                    userId = r.get('user_id');

                // temporarily persist value in model instance until backend is implemented
                if (userId in conferenceReadyTimes) {
                    if (v === undefined) {
                        v = conferenceReadyTimes[userId];
                    } else {
                        conferenceReadyTimes[userId] = v;
                    }
                } else if(r.get('phase') == 'conference') {
                    conferenceReadyTimes[userId] = v = Ext.Object.getSize(conferenceReadyTimes) ? new Date(Date.now() - (Math.random() * 1000 * 60 * 10)) : null;
                }

                return v || null;
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
                    userId = r.get('user_id');

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
    ]
});