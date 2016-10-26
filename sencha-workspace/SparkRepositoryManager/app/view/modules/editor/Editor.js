Ext.define('SparkRepositoryManager.view.units.editor.Editor', {
    extend: 'Ext.Panel',
    requires: [
        'SparkRepositoryManager.view.units.editor.Intro',
        'SparkRepositoryManager.view.units.editor.Learn',
        'SparkRepositoryManager.view.units.editor.Questions',
        'SparkRepositoryManager.view.units.editor.Resources',
        'SparkRepositoryManager.view.units.editor.Apply',
        'SparkRepositoryManager.view.units.editor.Assess'
    ],
    xtype: 's2m-units-editor',

    componentCls: 's2m-units-editor',

    padding: '10 0 0',
    bodyPadding: '5 21',
    scrollable: true,
    dockedItems: [
        {
            xtype: 'toolbar',
            docked: 'top',
            items: [
                {
                    xtype: 'button',
                    text: 'Clone Unit'
                },
                '-',
                {
                    xtype: 'checkbox',
                    boxLabel: 'Share unit globally'
                }
            ]
        }
    ],
    items: [
        {
            xtype: 'container',
            items: [
                {
                    xtype: 'container',
                    cls: 's2m-units-editor-meta',
                    margin: '10 0 20',
                    layout: {
                        type: 'hbox'
                    },
                    defaults: {
                        xtype: 'textfield',
                        labelAlign: 'top',
                        labelSeparator: ''
                    },
                    items: [
                        {
                            width: 192,
                            margin: '0 20 0 0',
                            fieldLabel: 'Code',
                            value: 'Ex: G6.U.3.4.A' // TODO remove hardcoded value
                        },
                        {
                            flex: 1,
                            fieldLabel: 'Title',
                            value: 'Ex: Long form essays about American revolutionaries in North Carolina' // TODO remove
                        }
                    ]
                },
                {
                    xtype: 'tabpanel',
                    bodyPadding: '20 0',
                    items: [
                        {
                            xtype: 's2m-units-editor-intro'
                        },
                        {
                            xtype: 's2m-units-editor-learn'
                        },
                        {
                            xtype: 's2m-units-editor-questions'
                        },
                        {
                            xtype: 's2m-units-editor-resources'
                        },
                        {
                            xtype: 's2m-units-editor-apply'
                        },
                        {
                            xtype: 's2m-units-editor-assess'
                        }
                    ]
                }
            ]
        }
    ]
});