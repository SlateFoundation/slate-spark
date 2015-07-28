/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.work.assess.Footer', {
    extend: 'Ext.Toolbar',
    xtype: 'spark-teacher-work-assess-footer',

    config: {
        items: [
            {
                xtype: 'button',
                text: 'Assign Learns'
            },
            {
                xtype: 'button',
                text: 'Schedule Interaction'
            },
            {
                xtype: 'button',
                text: 'Standard Completed'
            }
        ]
    }
});