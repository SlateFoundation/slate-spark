/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.help.Container', {
    extend: 'Ext.Panel',
    xtype: 'spark-help',
    requires: [
        'Ext.form.FieldSet',
        'Ext.field.Radio'
    ],

    config: {
    	/*
			these are style work around for a ExtJS 6 modern bug:
			https://goo.gl/t2xakq
    	*/
    	margin: '-17 0', // needs handled with sass
    	left: 0,

    	width: 400,
        items: [
        	{
        		xtype: 'container',
                layout: 'hbox',
                items: [
                     {
                        xtype: 'fieldset',
                        flex: 1,
                        defaults: {
                            xtype: 'radiofield',
                            name : 'request',
                            labelAlign: 'right'
                        },
                        items: [
                            /*
                                Another possible ExtJS 6 modern bug, hard coded until figured out
                                The radio fields do not function right, even in the documentation
                                https://goo.gl/aacKWe
                            */
                            {
                                value: 'bathroom',
                                label: 'Bathroom',
                                checked: true
                            },
                            {
                                value: 'nurse',
                                label: 'Nurse'
                            },
                            {
                                value: 'locker',
                                label: 'Locker'
                            },
                            {
                                value: 'general_question',
                                label: 'General Question'
                            },
                            {
                                value: 'academic_question',
                                label: 'Academic Question'
                            },
                            {
                                value: 'technology_question',
                                label: 'Technology Question'
                            }
                        ]
                    },
                    {
                        xtype: 'spark-waitlist'
                    }
                ]
        	}
        ]
    }
});