Ext.define('SparkClassroomStudent.view.Welcome', {
    extend: 'Ext.Component',
    xtype: 'spark-student-welcome',


    config: {
        cls: 'welcome-view welcome-view-student',
        html: '<h1 class="welcome-title">Welcome to Spark!</h1> <p class="welcome-intro">Select a class and a Sparkpoint to begin.</p>'
    }
});