/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.work.apply.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-work-apply',

    config: {
        layout: 'hbox',
        items: [
            {
                xtype: 'container',
                flex: 1,
                layout: 'vbox',
                items: [
                    {
                        xtype: 'component',
                        html: 'write it!'
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'container',
                                layout: 'hbox',
                                items: [
                                    {
                                        xtype: 'container',
                                        flex: 1,
                                        items: [
                                            {
                                                xtype: 'component',
                                                html: 'Standards Being Applied'
                                            },
                                            {
                                                xtype: 'component',
                                                html: 'CCSS.ELA.4.CC.4.A'
                                            },
                                            {
                                                xtype: 'component',
                                                html: 'CCSS.ELA.4.CC.4.A'
                                            },
                                            {
                                                xtype: 'component',
                                                html: 'CCSS.ELA.4.CC.4.A'
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'container',
                                        flex: 1,
                                        items: [
                                            {
                                                xtype: 'component',
                                                html: 'Related docs'
                                            },
                                            {
                                                xtype: 'component',
                                                html: [
                                                    '<ol>',
                                                        '<li>Link to Google Doc</li>',
                                                        '<li>Link to Google Doc</li>',
                                                        '<li>Link to Google Doc</li>',
                                                    '</ol>'
                                                ].join('')
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype: 'component',
                        html: 'TODOs'
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'component',
                                flex: 1,
                                html: 'reflection'
                            },
                            {
                                xtype: 'component',
                                flex: 1,
                                html: 'submitted docs'
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'container',
                width: '30%',
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
                        html: 'grade the reply'
                    }
                ]
            }
        ]
    }
});