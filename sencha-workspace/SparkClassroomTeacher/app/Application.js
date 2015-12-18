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

    /**
     * @event activestudentselect
     * Fires when the user selects a course section.
     * @param {SparkClassroomTeacher.model.gps.ActiveStudent} activeStudent The code for the newly selected section
     * @param {SparkClassroomTeacher.model.gps.ActiveStudent/null} oldActiveStudent The code for the previously selected section if any
     */


    name: 'SparkClassroomTeacher',

    controllers: [
        'Viewport',

        'GPS',
        'Work',
        'work.Learn',
        'work.Conference',
        'work.Apply',
        'work.Assess',

        'Competencies',
        'Assign',
        'Activity'
    ],

    config: {
        /**
         * @private
         * Tracks section last selected via {@link #event-sectionselect}
         */
        activeSection: null,

        /**
         * @inheritdoc
         * @private
         * Preconfigure the viewport to start with a top-level scrollable container for the main UI components
         */
        viewport: {
            items: {
                itemId: 'appCt',

                xtype: 'container',
                layout: 'auto',
                scrollable: 'vertical'
            }
        }
    },

    listen: {
        controller: {
            '#': {
                sectionselect: 'onSectionSelect'
            }
        },
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


    // config handlers
    updateActiveSection: function(section, oldSection) {
        var apiHost = Slate.API.getHost();

        Slate.API.setExtraParams({
            section: section
        });

        if (oldSection) {
            SparkClassroom.Socket.emit('unsubscribe', {
                section: oldSection,
                host: apiHost
            });
        }

        SparkClassroom.Socket.emit('subscribe', {
            section: section,
            host: apiHost
        });
    },


    // event handers
    onSectionSelect: function(section, oldSection) {
        this.setActiveSection(section);
    },

    onSocketReconnect: function() {
        var section = this.getActiveSection();

        if (section) {
            SparkClassroom.Socket.emit('subscribe', {
                section: section,
                host: Slate.API.getHost()
            });
        }
    }
});