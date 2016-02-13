/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.NavBar', {
    extend: 'SparkClassroom.NavBar',
    xtype: 'spark-student-navbar',
    requires: [
        'Ext.field.Text',
        'Ext.dataview.List',
        'SparkClassroom.widget.SparkpointField',
        'Jarvus.util.format.FuzzyTime'
    ],

    config: {
        layout: {
            type: 'hbox',
            pack: 'center'
        },

        items: [
            {
                xtype: 'spark-sparkpointfield',
                suggestionsList: {
                    store: 'SparkpointsLookup'
                }
            },
            {
                itemId: 'timer',
                xtype: 'label',
                cls: 'spark-navbar-timer',
                tpl: [
                    '<tpl if="duration">',
                        '{duration:fuzzyDuration}',
                    '<tpl else>',
                        'Not Started',
                    '</tpl>'
                ],
                hidden: true
            },
            {
                xtype: 'component',
                flex: 1
            },
            {
                text: 'Classwork',
                itemId: 'work'
            },
            {
                text: 'Standards',
                itemId: 'standards',
                disabled: true
            },
            {
                text: 'GPS',
                itemId: 'gps',
                disabled: true
            },
            {
                text: 'Activity',
                itemId: 'activity',
                disabled: true
            },
            {
                text: 'Help',
                itemId: 'help'
            }
        ]
    }
});