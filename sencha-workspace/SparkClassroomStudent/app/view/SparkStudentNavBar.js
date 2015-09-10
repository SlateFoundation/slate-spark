/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.SparkStudentNavBar', {
    extend: 'SparkClassroom.NavBar',
    xtype: 'spark-student-navbar',

    config: {

        layout: {
            type: 'hbox',
            pack: 'center'
        },

        items: [
            {
                xtype: 'selectfield',
                cls: 'spark-navbar-standard-selector',
                label: 'Standard',
                labelCls: 'visually-hidden',
                options: [
                {
                    text: 'Select Standard'
                }
            ]
            },
            {
                xtype: 'label',
                cls: 'spark-navbar-timer',
                html: '5 days'
            },
            {
                xtype: 'component',
                flex: 1
            },
            {
                text: 'Classwork',
                itemId: 'classwork',
                cls: 'is-selected'
            },
            {
                text: 'Standards',
                itemId: 'standards'
            },
            {
                text: 'GPS',
                itemId: 'gps'
            },
            {
                text: 'Activity',
                itemId: 'activity'
            },
            {
                text: 'Help',
                itemId: 'help'
            }
        ]
    }
});