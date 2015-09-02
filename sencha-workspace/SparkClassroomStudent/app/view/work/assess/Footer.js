/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.work.assess.Footer', {
    extend: 'Ext.Container',
    xtype: 'spark-student-work-assess-footer',

    config: {
        layout: {
            type: 'hbox',
            pack: 'end'
        },
        items: [
            {
                xtype: 'button',
                ui: 'action',
                text: 'Submit for Grading'
            }
        ]
    }
});