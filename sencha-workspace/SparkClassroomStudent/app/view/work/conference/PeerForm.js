/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.work.conference.PeerForm', {
    extend: 'Ext.form.Panel',
    xtype: 'spark-student-work-conference-peerform',
    cls: 'content-card',

    config: {
        defaults: {
            labelAlign: 'top'
        },
        items: [
            {
                xtype: 'textareafield',
                label: 'Restate the Sparkpoint in your own words.',
                maxRows: 3
            },
            {
                xtype: 'textareafield',
                label: 'Describe the steps used to show understanding of the skill.',
                maxRows: 6
            },
            {
                xtype: 'fieldset',
                cls: 'composite-field',
                title: 'Cite three real world examples of the Sparkpoint.',
                defaults: {
                    xtype: 'textfield',
                    labelAlign: 'left',
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
                        label: 'Peer’s name',
                        width: '18em',
                        store: 'Students',
                        valueField: 'ID',
                        displayField: 'FullName',
                        autoSelect: false
                    },
                    {
                        xtype: 'textareafield',
                        label: 'Feedback from peer'
                    }
                ]
            }
        ]
    }
});
