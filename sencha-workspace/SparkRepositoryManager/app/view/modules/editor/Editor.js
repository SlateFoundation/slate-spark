Ext.define('SparkRepositoryManager.view.modules.editor.Editor', {
    extend: 'Ext.Panel',
    xtype: 's2m-modules-editor',
    requires: [
        'SparkRepositoryManager.view.modules.editor.Intro',
        'SparkRepositoryManager.view.modules.editor.Learn',
        'SparkRepositoryManager.view.modules.editor.Questions',
        'SparkRepositoryManager.view.modules.editor.Resources',
        'SparkRepositoryManager.view.modules.editor.Apply',
        'SparkRepositoryManager.view.modules.editor.Assess'
    ],

    componentCls: 's2m-modules-editor',

    disabled: true,

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
                    name: 'published',
                    boxLabel: 'Publish module'
                },
                '-',
                {
                    xtype: 'checkbox',
                    name: 'shared',
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
                    xtype: 'form',
                    cls: 's2m-modules-editor-meta',
                    itemId: 'modules-meta-info',
                    margin: '10 0 20',
                    layout: {
                        type: 'hbox'
                    },
                    defaults: {
                        xtype: 'textfield',
                        labelAlign: 'top',
                        labelSeparator: '',
                        margin: '0 20 0 0'
                    },
                    items: [
                        {
                            fieldLabel: 'Grade',
                            name: 'grade',
                            xtype: 'combo',
                            width: 60,
                            store: ['PK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
                        },
                        {
                            fieldLabel: 'Content Area',
                            name: 'content_area',
                            xtype: 'combo',
                            width: 120,
                            store: ['Math', 'ELA', 'Science']
                        },
                        {
                            fieldLabel: 'Code',
                            name: 'code',
                            width: 180,
                            readOnly: true
                        },
                        {
                            fieldLabel: 'Title',
                            name: 'title',
                            flex: 1,
                            margin: 0,
                            checkChangeEvents: ['blur'],
                            value: 'Ex: Long form essays about American revolutionaries in North Carolina' // TODO remove
                        }
                    ]
                },
                {
                    xtype: 'tabpanel',
                    bodyPadding: '20 0',
                    activeTab: 3, // TODO: remove this, for dev
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
