/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.work.assess.Footer', {
    extend: 'Ext.Toolbar',
    xtype: 'spark-student-work-assess-footer',

    config: {
        items: [
            {
                xtype: 'button',
                text: 'Submit for grading'
            }
        ]
    }
});