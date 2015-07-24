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
                section: 'work'
            },
            {
                title: 'Competency Overview',
                section: 'competencies'
            },
            {
                title: 'Assign',
                section: 'assign'
            }
        ]
    }
});