/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('SparkClassroomTeacher.Application', {
    extend: 'Ext.app.Application',
    requires: [
        'Slate.API',
        'Ext.MessageBox'
    ],

    views: [
        'TitleBar@SparkClassroom',
        'TabsContainer'
    ],

    controllers: [
        'Viewport',
        'GPS',
        'Work',
        'Competencies',
        'Assign'
    ],

    config: {
        viewport: {
            layout: 'auto',
            scrollable: 'vertical'
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