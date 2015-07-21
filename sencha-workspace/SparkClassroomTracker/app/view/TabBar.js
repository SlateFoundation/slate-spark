/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.TabBar', {
    extend: 'Ext.tab.Bar',
    xtype: 'spark-tabbar',

    config: {
        layout: {
            type: 'hbox',
            pack: 'center'
        },

        items: [
            {
                title: 'Student Work',
                section: 'student-work'
            },
            {
                title: 'Competency Overview',
                section: 'competency-overview'
            },
            {
                title: 'Assign',
                section: 'sparkpoints-assign'
            }
        ]
    }
});