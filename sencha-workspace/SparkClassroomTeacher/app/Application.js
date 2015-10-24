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
            },
            debug: function(socket, data) {
                console.info('socket debug:', data);
            }
            // </debug>
        }
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});