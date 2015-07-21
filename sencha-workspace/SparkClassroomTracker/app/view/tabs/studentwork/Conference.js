/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.tabs.studentwork.Conference', {
    extend: 'Ext.Container',
    xtype: 'spark-tabs-studentwork-conference',

    config: {
        title: 'Conference',
        items: [
            {
                layout: 'hbox',
                items: [
                    {
                        xtype: 'container',
                        flex: 1,
                        items: [
                            {
                                xtype: 'component',
                                html: 'lets of standards stuff'
                            },
                            {
                                xtype: 'component',
                                html: 'Standard 2'
                            },
                            {
                                xtype: 'component',
                                html: 'Standard 1'
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        width: '30%',
                        layout: 'vbox',
                        items: [
                            {
                                xtype: 'container',
                                layout: 'hbox',
                                items: [
                                    {
                                        xtype: 'component',
                                        html: 'timer'
                                    },
                                    {
                                        xtype: 'button',
                                        text: 'Pause Conference'
                                    }
                                ]
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
                            },
                            {
                                xtype: 'component',
                                html: 'mastery score'
                            }
                        ]
                    }
                ]
            }
        ]
    }
});