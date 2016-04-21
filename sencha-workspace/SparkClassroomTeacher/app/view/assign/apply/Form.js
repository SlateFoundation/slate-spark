Ext.define('SparkClassroomTeacher.view.assign.apply.Form', {
    extend: 'Ext.form.Panel',
    xtype: 'spark-assign-apply-form',

    config: {
        items: [
            {
                xtype: 'textareafield',
                labelAlign: 'top',
                label: 'Instructions'
            },
            {
                xtype: 'fieldset',
                layout: 'hbox',
                title: 'Time Estimate',
                cls: 'composite-field',
                items: [
                    {
                        xtype: 'textfield',
                        placeHolder: 'H',
                        width: 64
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
                        placeHolder: 'MM',
                        width: 64
                    },
                    {
                        flex: 1
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: 'To-Dos',
                cls: 'composite-field',
                items: [
                    {
                        xtype: 'textfield'
                    },
                    // TODO start with two fields and add a blank one every the last one has text entered
                    {
                        xtype: 'textfield'
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: 'Links',
                cls: 'composite-field',
                items: [
                    {
                        xtype: 'textfield',
                        placeHolder: 'http://example.com/video/908'
                    },
                    // TODO same as above; always have a fresh blank field at the bottom of this list
                    {
                        xtype: 'textfield'
                    }
                ]
            }
        ]
    }
});