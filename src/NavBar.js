/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.NavBar', {
    extend: 'Ext.Toolbar',
    xtype: 'spark-navbar',
    cls: 'spark-navbar',

    config: {
        layout: {
            pack: 'end'
        },

        items: [
            {
                text: 'Student Work',
                itemId: 'work'
            },
            {
                text: 'Competency Overview',
                itemId: 'competencies'
            },
            {
                text: 'Assign Sparkpoints',
                itemId: 'assign'
            },
            {
                text: 'Activity',
                itemId: 'activity'
            }
        ]
    }
});