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
                padding: '16 0 0',
                defaults: {
                    xtype: 'radiofield',
                    name: 'request',
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
                        label: 'Bathroom'
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
                        xtype: 'container',
                        padding: '16 16 0',
                        items: [
                            {
                                xtype: 'button',
                                text: 'Submit',
                                ui: 'action',
                                action: 'submit-helprequest',
                                disabled: true
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'container',
                cls: 'spark-waitlist',
                items: [
                    {
                        xtype: 'container',
                        cls: 'spark-waitlist-title',
                        html: 'Waitlist'
                    },
                    {
                        xtype: 'spark-waitlist'
                    }
                ]
            }
        ]
    }
});