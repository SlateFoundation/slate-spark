Ext.define('SparkClassroomTeacher.view.assign.apply.Form', {
    extend: 'Ext.form.Panel',
    xtype: 'spark-assign-apply-form',

    config: {
        items: [
            {
                xtype: 'textareafield',
                itemId: 'instructions',
                labelAlign: 'top',
                label: 'Instructions',
                readOnly: true,
                clearIcon: false,
            },
            {
                xtype: 'fieldset',
                layout: 'hbox',
                title: 'Time Estimate',
                cls: 'composite-field',
                items: [
                    {
                        xtype: 'textfield',
                        itemId: 'hours',
                        placeHolder: 'H',
                        width: 64,
                        readOnly: true,
                        clearIcon: false,
                    },
                    {
                        xtype: 'component',
                        html: ':',
                        padding: '7 8 0',
                        style: {
                            fontWeight: 'bold',
                            textAlign: 'center'
                        }
                    },
                    {
                        xtype: 'textfield',
                        itemId: 'minutes',
                        placeHolder: 'MM',
                        width: 64,
                        readOnly: true,
                        clearIcon: false,
                    },
                    {
                        flex: 1
                    }
                ]
            },
            {
                xtype: 'fieldset',
                itemId: 'todos',
                title: 'To-Dos',
                cls: 'composite-field',
                items: [
                    {
                        xtype: 'textfield'
                    }
                ]
            },
            {
                xtype: 'fieldset',
                itemId: 'links',
                title: 'Links',
                cls: 'composite-field',
                items: [
                    {
                        xtype: 'textfield',
                        placeHolder: 'http://example.com/video/908'
                    }
                ]
            }
        ]
    }
});