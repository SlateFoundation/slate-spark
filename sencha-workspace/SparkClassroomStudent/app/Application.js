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

    config: {
        activeSection: null,

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
    onSectionSelect: function(section) {
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