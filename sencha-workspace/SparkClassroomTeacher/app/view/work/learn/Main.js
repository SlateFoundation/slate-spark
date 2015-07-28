/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.work.learn.Main', {
    extend: 'SparkClassroom.work.learn.Main',
    xtype: 'spark-teacher-work-learn',
    requires: [
        'SparkClassroomTeacher.view.work.learn.Form'
    ],

    config: {
        layout: 'hbox'
    },
    
    initialize: function () {
        this.callParent(arguments);
        
        this.add({
            xtype: 'spark-teacher-work-learn-form',
            width: '30%'
        });
    }
});