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
                itemId: 'standardGrid',
                flex: 1,
                items: [
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