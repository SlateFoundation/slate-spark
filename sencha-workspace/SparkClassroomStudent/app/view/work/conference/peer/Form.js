/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.work.conference.peer.Form', {
    extend: 'Ext.form.Panel',
    xtype: 'spark-student-work-conference-peer-form',
    cls: 'content-card',

    config: {
        defaults: {
            labelAlign: 'top'
        },
        items: [
            {
                xtype: 'textareafield',
                label: 'Restate the Learn target in your own words.',
                maxRows: 3,
            },
            {
                xtype: 'textareafield',
                label: 'Describe the steps used to show understanding of the skill.',
                maxRows: 6
            },
            {
                xtype: 'fieldset',
                cls: 'composite-field',
                title: 'Cite three real world examples of the learning target.',
                defaults: {
                    xtype: 'textfield',
                    labelWidth: '2.5em'
                },
                items: [
                    {
                        label: '1.'
                    },
                    {
                        label: '2.'
                    },
                    {
                        label: '3.'
                    }
                ]
            },
            {
                xtype: 'component',
                html: '<hr class="content-card-separator">'
            },
            {
                xtype: 'fieldset',
                title: 'Peer Conference <small>(Optional)</small>',
                defaults: {
                    labelAlign: 'top'
                },
                items: [
                    {
                        xtype: 'selectfield',
                        label: 'Peer’s Name',
                        width: '18em',
                        options: [
                            "stuff"
                        ]
                    },
                    {
                        xtype: 'textareafield',
                        label: 'Feedback From Peer'
                    }
                ]
            }
        ]
    }
});