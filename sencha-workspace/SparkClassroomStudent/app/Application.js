/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('SparkClassroomStudent.Application', {
    extend: 'Ext.app.Application',
    requires: [
        // TODO: these aren't being used here and should be rquired via views config
        'SparkClassroom.TitleBar',
        'SparkClassroom.NavBar',
        'SparkClassroom.work.TabBar',
        'SparkClassroomStudent.view.TabsContainer',
        'Ext.MessageBox'
    ],

    // TODO: move these to where they're being used
    views: [
        'work.apply.Container',
        'work.learn.Container',
        'work.conference.Container',
        'work.assess.Container',
        'SparkStudentNavBar'
    ],

    controllers: [
        'Viewport',
        'Learn',
        'Conference',
        'Apply',
        'Assess'
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
