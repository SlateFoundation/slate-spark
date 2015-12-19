/* global SparkClassroom */
/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('SparkClassroomStudent.Application', {
    extend: 'Ext.app.Application',
    requires: [
        'Ext.MessageBox',
        'SparkClassroom.SocketDomain'
    ],


    name: 'SparkClassroomStudent',

    controllers: [
        'analytics.Clicky',
        'analytics.TrackJS',

        'Viewport',

        'Work',
        'work.Learn',
        'work.Conference',
        'work.Apply',
        'work.Assess',

        'Standards',
        'Activity',
        'Help',
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