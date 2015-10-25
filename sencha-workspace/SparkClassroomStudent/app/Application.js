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
        'Viewport',
        'ActivityTracker',

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
    onSectionSelect: function(section) {
        Slate.API.setExtraParams({
            section_id: section
        });
    }
});
