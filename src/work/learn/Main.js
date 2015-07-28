/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.learn.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-work-learn',
    requires: [
        'SparkClassroom.work.learn.AssignmentGrid',
        'Jarvus.touch.layout.Accordion'
    ],

    config: {
        layout: 'hbox',
        items: [
            {
                xtype: 'container',
                layout: 'vbox',
                flex: 1,
                items: [
                    {
                        xtype: 'component',
                        html: 'Alexandra W has 3 out of 5 stars',
                        userClass: 'Student'
                    },
                    {
                        xtype: 'container',
                        layout: 'accordion',
                        flex: 1,
                        items: [
                            {
                                xtype: 'spark-work-learn-assignmentgrid',
                                title: 'Standards Blarg'
                            },
                            {
                                xtype: 'component',
                                html: 'stuff',
                                title: 'Standard 2'
                            },
                            {
                                xtype: 'component',
                                html: 'stuff',
                                title: 'Standard 1'
                            }
                        ]
                    }
                ]
            }
        ]
    }
});