/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.Welcome', {
    extend: 'Ext.Component',
    xtype: 'spark-student-welcome',


    config: {
        styleHtmlContent: true,
        html: '<h2>Welcome to Spark!</h2><p>Select a class and sparkpoint to begin.</p>'
    }
});