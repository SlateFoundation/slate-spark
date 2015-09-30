/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.help.Container', {
    extend: 'SparkClassroom.NavSubpanel',
    xtype: 'spark-help',
    requires: [
        'Ext.form.FieldSet',
        'Ext.field.Radio',
        'SparkClassroomStudent.view.help.Waitlist'
    ],

    config: {
        width: 480,
        layout: 'hbox',
        defaults: {
            flex: 1
        },
        items: [
                {
                xtype: 'fieldset',
                cls: 'radio-group',
                defaults: {
                    xtype: 'radiofield',
                    name : 'request',
                    labelAlign: 'right',
                    labelWidth: 200 // TODO find a way to make the labels "flex"
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
                        value: 'question-general',
                        label: 'General Question'
                    },
                    {
                        value: 'question-academic',
                        label: 'Academic Question'
                    },
                    {
                        value: 'question-technology',
                        label: 'Technology Question'
                    },
                    {
                        xtype: 'button',
                        text: 'Submit',
                        height: 75,
                        action: 'submit-helprequest'
                    }
                ]
            },
            {
                xtype: 'spark-waitlist'
            }
        ]
    }
});