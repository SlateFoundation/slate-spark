Ext.define('SparkRepositoryManager.view.modules.editor.Editor', {
    extend: 'Ext.Panel',
    xtype: 's2m-modules-editor',
    requires: [
        'SparkRepositoryManager.view.modules.editor.Intro',
        'SparkRepositoryManager.view.modules.editor.Learn',
        'SparkRepositoryManager.view.modules.editor.Questions',
        'SparkRepositoryManager.view.modules.editor.Resources',
        'SparkRepositoryManager.view.modules.editor.Apply',
        'SparkRepositoryManager.view.modules.editor.Assess',
        'SparkRepositoryManager.store.sparkpoints.ContentAreas'
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
                    action: 'clone',
                    text: 'Clone Module'
                },
                '-',
                {
                    xtype: 'button',
                    action: 'publish',
                    text: 'Publish module'
                },
                '-',
                {
                    xtype: 'checkbox',
                    name: 'global',
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
                            name: 'content_area_id',
                            xtype: 'combo',
                            displayField: 'code',
                            valueField: 'id',
                            width: 120,
                            store: {
                                xclass: 'SparkRepositoryManager.store.sparkpoints.ContentAreas'
                            }
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
                            checkChangeEvents: ['blur']
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
