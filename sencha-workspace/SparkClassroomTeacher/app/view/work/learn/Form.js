/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.work.learn.Form', {
    extend: 'Ext.form.Panel',
    xtype: 'spark-teacher-work-learn-form',

    config: {

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
});