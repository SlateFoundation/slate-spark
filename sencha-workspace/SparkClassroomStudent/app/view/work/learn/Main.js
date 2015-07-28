/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.work.learn.Main', {
    extend: 'SparkClassroom.work.learn.Main',
    xtype: 'spark-student-work-learn',

    config: {
        layout: 'hbox'
    },
    
    initialize: function () {
        this.callParent(arguments);
        
        this.getComponent('standardGrid').insert(0, {
            xtype: 'component',
            html: 'Alexandra W has 3 out of 5 stars'
        });
    }
});