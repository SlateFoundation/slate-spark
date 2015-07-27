/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.view.work.conference.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-work-conference',
    requires: [
        'Jarvus.touch.layout.Accordion'
    ],

    config: {
        title: 'Conference',
        items: [
            {
                layout: 'hbox',
                items: [
                    {
                        xtype: 'container',
                        layout: 'accordion',
                        flex: 1,
                        items: [
                            {
                                xtype: 'component',
                                html: 'lets of standards stuff',
                                title: 'Stanards Breh'
                            },
                            {
                                xtype: 'component',
                                html: 'check me out',
                                title: 'Standard 2'
                            },
                            {
                                xtype: 'component',
                                html: 'I\'m a standard',
                                title: 'Standard 1'
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