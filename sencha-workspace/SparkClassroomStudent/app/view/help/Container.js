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
});