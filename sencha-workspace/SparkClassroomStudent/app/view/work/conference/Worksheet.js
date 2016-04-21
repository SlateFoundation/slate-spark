Ext.define('SparkClassroomStudent.view.work.conference.Worksheet', {
    extend: 'Ext.form.Panel',
    xtype: 'spark-student-work-conference-worksheet',
    cls: 'content-card',

    config: {
        defaults: {
            labelAlign: 'top'
        },
        items: [
            {
                xtype: 'textareafield',
                name: 'restated',
                label: 'Restate the Sparkpoint in your own words.',
                maxRows: 3
            },
            {
                xtype: 'textareafield',
                name: 'steps',
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
                        label: '1.',
                        name: 'example_1'
                    },
                    {
                        label: '2.',
                        name: 'example_2'
                    },
                    {
                        label: '3.',
                        name: 'example_3'
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
                        name: 'peer_id',
                        label: 'Peer’s name',
                        width: '18em',
                        store: 'Students',
                        valueField: 'ID',
                        displayField: 'FullName',
                        autoSelect: false
                    },
                    {
                        xtype: 'textareafield',
                        name: 'peer_feedback',
                        label: 'Feedback from peer'
                    }
                ]
            }
        ]
    }
});
