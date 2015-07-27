/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.view.work.learn.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-work-learn',
    requires: [
        'SparkClassroom.view.work.learn.AssignmentGrid',
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
            },
            {
                xtype: 'container',
                width: '30%',
                userClass: 'Teacher',
                layout: 'vbox',
                items: [
                    {
                        xtype: 'component',
                        html: 'required learns'
                    },
                    {
                        xtype: 'component',
                        html: 'mastery score'
                    },
                    {
                        xtype: 'formpanel',
                        flex: 1,
                        items: [
                            {
                                xtype: 'textfield',
                                placeHolder: 'Subject'
                            },
                            {
                                xtype: 'textareafield',
                                placeHolder: 'Message'
                            },
                            {
                                xtype: 'fieldset',
                                label: 'To',
                                items: [
                                    {
                                        xtype: 'radiofield',
                                        label: 'Alexandra W'
                                    },
                                    {
                                        xtype: 'radiofield',
                                        label: 'Current Standard'
                                    },
                                    {
                                        xtype: 'radiofield',
                                        label: 'All in group'
                                    },
                                    {
                                        xtype: 'radiofield',
                                        label: 'All in Conference'
                                    }
                                ]
                            },
                            {
                                xtype: 'button',
                                text: 'Log'
                            }
                        ]
                    }
                ]
            }
        ]
    }
});