Ext.define('SparkRepositoryManager.view.lessons.editor.Editor', {
    extend: 'Ext.Panel',
    xtype: 's2m-lessons-editor',
    requires: [
        'SparkRepositoryManager.view.lessons.editor.Intro',
        'SparkRepositoryManager.view.lessons.editor.Learn',
        'SparkRepositoryManager.view.lessons.editor.Questions',
        'SparkRepositoryManager.view.lessons.editor.Resources',
        'SparkRepositoryManager.view.lessons.editor.Apply',
        'SparkRepositoryManager.view.lessons.editor.Assess',
        'SparkRepositoryManager.store.sparkpoints.ContentAreas'
    ],


    componentCls: 's2m-lessons-editor',

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
                    text: 'Clone Lesson'
                },
                '-',
                {
                    xtype: 'button',
                    action: 'publish',
                    text: 'Publish lesson'
                },
                '-',
                {
                    xtype: 'checkbox',
                    name: 'global',
                    boxLabel: 'Share lesson globally'
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
                    cls: 's2m-lessons-editor-meta',
                    itemId: 'lessons-meta-info',
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
                            queryMode: 'local',
                            width: 60,
                            store: ['PK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
                        },
                        {
                            fieldLabel: 'Content Area',
                            name: 'content_area_id',
                            xtype: 'combo',
                            queryMode: 'local',
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
                            xtype: 's2m-lessons-editor-intro'
                        },
                        {
                            xtype: 's2m-lessons-editor-learn'
                        },
                        {
                            xtype: 's2m-lessons-editor-questions'
                        },
                        {
                            xtype: 's2m-lessons-editor-resources'
                        },
                        {
                            xtype: 's2m-lessons-editor-apply'
                        },
                        {
                            xtype: 's2m-lessons-editor-assess'
                        }
                    ]
                }
            ]
        }
    ]
});
