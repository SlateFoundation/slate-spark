/* global SparkClassroom */
/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('SparkClassroomTeacher.Application', {
    extend: 'Ext.app.Application',
    requires: [
        'Ext.MessageBox',
        'SparkClassroom.SocketDomain'
    ],


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
            // <debug>
            connect: function(socket) {
                console.info('socket connected');
            },
            disconnect: function(socket) {
                console.warn('socket disconnected');
            },
            data: function(socket, data) {
                console.info('socket data:', data);
            }
            emit: function(socket, event, data) {
                console.info('socket emit %s:', event, data);
            },
            debug: function(socket, data) {
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


    // event handers
    onSectionSelect: function(section, oldSection) {
        Slate.API.setExtraParams({
            section: section
        });

        if (oldSection) {
            SparkClassroom.Socket.emit('unsubscribe', {
                section: oldSection,
                host: Slate.API.getHost()
            });
        }

        SparkClassroom.Socket.emit('subscribe', {
            section: section,
            host: Slate.API.getHost()
        });
    }
});