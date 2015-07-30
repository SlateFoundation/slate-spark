/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.points.apply.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-assign-points-apply',
    requires: [
        'SparkClassroomTeacher.view.assign.points.apply.Grid'
    ],

    config: {
        title: 'Apply',
        layout: 'hbox',
        items: [
            {
                xtype: 'spark-assign-points-apply-grid',
                flex: 1
            },
            {
                xtype: 'formpanel',
                width: '25%',
                items: [
                    {
                        xtype: 'textareafield',
                        label: 'Instructions'
                    },
                    {
                        xtype: 'fieldset',
                        layout: 'hbox',
                        label: 'Time Estimate',
                        items: [
                            {
                                xtype: 'textfield',
                                placeHolder: '1 Hour',
                                flex: 1
                            },
                            {
                                xtype: 'textfield',
                                placeHolder: '30 Minutes',
                                flex: 1
                            }
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        label: 'ToDOs',
                        items: [
                            {
                                xtype: 'textfield',
                                placeHolder: 'TODO 1'
                            },
                            {
                                xtype: 'textfield',
                                placeHolder: 'TODO 2'
                            },
                            {
                                xtype: 'textfield',
                                placeHolder: 'TODO 3'
                            }
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        label: 'Links',
                        items: [
                            {
                                xtype: 'textfield',
                                placeHolder: 'http://stuff.com'
                            },
                            {
                                xtype: 'textfield',
                                placeHolder: 'http://youtube.com'
                            }
                        ]
                    }
                ]
            }
        ]
    }
});