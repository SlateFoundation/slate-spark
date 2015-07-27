/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.view.work.conference.peer.Form', {
    extend: 'Ext.form.Panel',
    xtype: 'spark-work-conference-peer-form',

    config: {
        items: [
            {
                xtype: 'textfield',
                label: 'Restate the Learn target in your own words',
                placeHodler: 'Active text field with green line belowe.'
            },
            {
                xtype: 'textareafield',
                label: 'Describe the steps used to show understanding of the skill'
            },
            {
                xtype: 'fieldset',
                label: 'Cite 3 real world examples of the learning target',
                items: [
                    {
                        xtype: 'textfield',
                        label: 1
                    },
                    {
                        xtype: 'textfield',
                        label: 2
                    },
                    {
                        xtype: 'textfield',
                        label: 3
                    }
                ]
            },
            {
                xtype: 'component',
                html: '<h4>Peer Conferenc:</h4> (optional)'
            },
            {
                xtype: 'selectfield',
                label: 'Peer\'s Name',
                options: [
                    "stuff"
                ]
            },
            {
                xtype: 'textareafield',
                label: 'Feedback from Peer'
            }
        ]
    }
});