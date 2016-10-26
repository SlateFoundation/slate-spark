Ext.define('SparkRepositoryManager.view.modules.editor.Editor', {
    extend: 'Ext.Panel',
    requires: [
        'SparkRepositoryManager.view.modules.editor.Intro',
        'SparkRepositoryManager.view.modules.editor.Learn',
        'SparkRepositoryManager.view.modules.editor.Questions',
        'SparkRepositoryManager.view.modules.editor.Resources',
        'SparkRepositoryManager.view.modules.editor.Apply',
        'SparkRepositoryManager.view.modules.editor.Assess'
    ],
    xtype: 's2m-modules-editor',

    componentCls: 's2m-modules-editor',

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
                    text: 'Clone Module'
                },
                '-',
                {
                    xtype: 'checkbox',
                    boxLabel: 'Share module globally'
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
                    cls: 's2m-modules-editor-meta',
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
                            xtype: 's2m-modules-editor-intro'
                        },
                        {
                            xtype: 's2m-modules-editor-learn'
                        },
                        {
                            xtype: 's2m-modules-editor-questions'
                        },
                        {
                            xtype: 's2m-modules-editor-resources'
                        },
                        {
                            xtype: 's2m-modules-editor-apply'
                        },
                        {
                            xtype: 's2m-modules-editor-assess'
                        }
                    ]
                }
            ]
        }
    ]
});
