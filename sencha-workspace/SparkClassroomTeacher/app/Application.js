/* global Ext */
/* global Slate */
/* global SparkClassroom */
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
        'SparkClassroom.SocketDomain'
    ],

    /**
     * @event sectionselect
     * Fires when the user selects a course section.
     * @param {String} section The code for the newly selected section
     * @param {String/null} oldSection The code for the previously selected section if any
     */


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

        'Competencies',
        'Activity',
        'Help',
        'Priorities'
    ],

    views: [
        'AppContainer'
    ],

    config: {
        /**
         * @private
         * Tracks section last selected via {@link #event-sectionselect}
         */
        selectedSection: null,

        /**
         * @inheritdoc
         * @private
         * Preconfigure the viewport to start with a top-level scrollable container for the main UI components
         */
        viewport: {
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
            selectedsectionchange: 'onSelectedSectionChange'
        },
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

        this.setSelectedSection(selectedSection);

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

    onSocketReconnect: function() {
        var selectedSection = this.getSelectedSection();

        if (selectedSection) {
            SparkClassroom.Socket.emit('subscribe', {
                section: selectedSection,
                host: Slate.API.getHost()
            });
        }
    }
});