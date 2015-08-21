/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.TeacherTabBar', {
    extend: 'Ext.tab.Bar',
    xtype: 'spark-teacher-tabbar',
    cls: 'spark-teacher-tabbar',

    config: {
        layout: {
            type: 'hbox',
            pack: 'center'
        },

        defaults: {
            flex: 1
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