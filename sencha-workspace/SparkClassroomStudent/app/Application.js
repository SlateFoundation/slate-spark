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
Ext.define('SparkClassroomStudent.Application', {
    extend: 'Ext.app.Application',
    requires: [
        'Ext.MessageBox',

        /* global Slate */
        'Slate.API',

        /* global SparkClassroom */
        'SparkClassroom.SocketDomain',
        'SparkClassroom.Socket'
    ],


    name: 'SparkClassroomStudent',

    controllers: [
        'analytics.Clicky@SparkClassroom.controller',
        'analytics.TrackJS@SparkClassroom.controller',

        'Viewport',

        'Work',
        'work.Learn',
        'work.Conference',
        'work.Apply',
        'work.Assess',

        'Standards',
        'Activity',
        'Help'
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
                xtype: 'spark-student-appct'
            }
        }
    },

    refs: {
        appCt: 'spark-student-appct'
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
            selectedsectioncodechange: 'onSelectedSectionCodeChange'
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
    onSelectedSectionCodeChange: function(appCt, sectionCode, oldSectionCode) {
        var apiHost = Slate.API.getHost();

        Slate.API.setExtraParams({
            section: sectionCode
        });

        if (oldSectionCode) {
            SparkClassroom.Socket.emit('unsubscribe', {
                section: oldSectionCode,
                host: apiHost
            });
        }

        SparkClassroom.Socket.emit('subscribe', {
            section: sectionCode,
            host: apiHost
        });
    },

    onSocketReconnect: function() {
        var selectedSectionCode = this.getAppCt().getSelectedSectionCode();

        if (selectedSectionCode) {
            SparkClassroom.Socket.emit('subscribe', {
                section: selectedSectionCode,
                host: Slate.API.getHost()
            });
        }
    }
});