/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('SparkClassroomStudent.Application', {
    extend: 'Ext.app.Application',
    requires: [
        'Ext.MessageBox'
    ],


    name: 'SparkClassroomStudent',

    controllers: [
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
        viewport: {
            items: {
                itemId: 'appCt',

                xtype: 'container',
                layout: 'auto',
                scrollable: 'vertical'
            }
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
