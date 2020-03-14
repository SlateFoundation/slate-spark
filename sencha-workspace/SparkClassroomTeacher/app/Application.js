/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). It is a special controller that is responsible for loading
 * all other controllers and configuring the application at the top level.
 *
 * ## Responsibilities
 * - Define controllers and their load order
 * - Configure viewport
 * - Maintain socket connection to spark-realtime backend
 * - Present UI to reload application if HTML5 manifest cache gets updated (not currently in use)
 */
Ext.define('SparkClassroomTeacher.Application', {
    extend: 'Ext.app.Application',
    requires: [
        'Ext.MessageBox',

        /* global Slate */
        'Slate.API',

        /* global SparkClassroom */
        'SparkClassroom.SocketDomain',
        'SparkClassroom.Socket'
    ],


    name: 'SparkClassroomTeacher',

    controllers: [
        'analytics.Clicky@SparkClassroom.controller',
        'analytics.TrackJS@SparkClassroom.controller',

        'Viewport',

        'GPS',
        'Work',
        'work.Learn',
        'work.Conference',
        'work.Apply',
        'work.Assess',

        'Assign',
        'assign.Learns',
        'assign.ConferenceQuestions',
        'assign.ConferenceResources',
        'assign.Applies',

        'Competencies',
        'competencies.StudentCompetency',
        'competencies.SparkpointsConfig',

        'Activity',
        'Help',
        'Priorities'
    ],

    views: [
        'AppContainer'
    ],

    config: {

        /**
         * @inheritdoc
         * @private
         * Preconfigure the viewport to start with a top-level scrollable container for the main UI components
         */
        viewport: {
            id: 'slateapp-viewport',
            cls: ['site', 'wrapper'],
            items: {
                xtype: 'spark-teacher-appct'
            }
        }
    },

    refs: {
        appCt: 'spark-teacher-appct'
    },

    listen: {
        socket: {
            reconnect: 'onSocketReconnect'

            // <debug>
            ,connect: function(socket) {
                console.info('socket connected');
            }
            ,disconnect: function(socket) {
                console.warn('socket disconnected');
            }
            ,data: function(socket, data) {
                console.info('socket data:', data);
            }
            ,emit: function(socket, event, data) {
                console.info('socket emit %s:', event, data);
            }
            ,debug: function(socket, data) {
                console.info('socket debug:', data);
            }
            // </debug>
        }
    },

    control: {
        appCt: {
            selectedsectionchange: 'onSelectedSectionChange',
            selectedstudentsparkpointchange: 'onSelectedStudentSparkpointChange'
        }
    },


    // template methods
    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    },


    // event handers
    onSelectedSectionChange: function(appCt, selectedSection, oldSelectedSection) {
        var apiHost = Slate.API.getHost();

        Slate.API.setExtraParams({
            section: selectedSection
        });

        if (oldSelectedSection) {
            SparkClassroom.Socket.emit('unsubscribe', {
                section: oldSelectedSection,
                host: apiHost
            });
        }

        SparkClassroom.Socket.emit('subscribe', {
            section: selectedSection,
            host: apiHost
        });
    },

    onSelectedStudentSparkpointChange: function(appCt, studentSparkpoint, oldStudentSparkpoint) {
        var apiHost = Slate.API.getHost();

        if (oldStudentSparkpoint) {
            SparkClassroom.Socket.emit('unsubscribe', {
                'student_id': oldStudentSparkpoint.get('student_id'),
                sparkpoint: oldStudentSparkpoint.get('sparkpoint'),
                host: apiHost
            });
        }

        if (studentSparkpoint) {
            SparkClassroom.Socket.emit('subscribe', {
                'student_id': studentSparkpoint.get('student_id'),
                sparkpoint: studentSparkpoint.get('sparkpoint'),
                host: apiHost
            });
        }
    },

    onSocketReconnect: function() {
        var selectedSection = this.getAppCt().getSelectedSection(),
            selectedStudentSparkpoint = this.getAppCt().getSelectedStudentSparkpoint(),
            apiHost = Slate.API.getHost();

        if (selectedSection) {
            SparkClassroom.Socket.emit('subscribe', {
                section: selectedSection,
                host: apiHost
            });
        }

        if (selectedStudentSparkpoint) {
            SparkClassroom.Socket.emit('subscribe', {
                'student_id': selectedStudentSparkpoint.get('student_id'),
                sparkpoint: selectedStudentSparkpoint.get('sparkpoint'),
                host: apiHost
            });
        }
    }
});