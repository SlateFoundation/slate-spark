Ext.define('SparkClassroomTeacher.view.FeedbackForm', {
    extend: 'Ext.form.Panel',
    xtype: 'spark-teacher-feedbackform',
    requires: [
        'Ext.Title',
        'Ext.field.TextArea',
        'Ext.Button'
    ],


    config: {
        sendButton: 'Send to Student',

        cls: 'content-card narrow',
        items: [
            {
                xtype: 'title',
                title: 'Feedback'
            },
            {
                xtype: 'textareafield',
                name: 'message',
                label: 'Message'
            }
        ]
    },

   applySendButton: function(sendButton, oldSendButton) {
        if (typeof sendButton == 'string') {
            sendButton = { text: sendButton };
        }

        Ext.applyIf(sendButton, {
            itemId: 'sendBtn',

            margin: '16 0 0',
            ui: 'action',
            iconCls: 'fa fa-send'
        });

        return Ext.factory(sendButton, Ext.Button, oldSendButton);
    },

    updateSendButton: function(sendButton, oldSendButton) {
        if (sendButton) {
            this.add(sendButton);
        }

        if (oldSendButton) {
            oldSendButton.destroy();
        }
    },
});