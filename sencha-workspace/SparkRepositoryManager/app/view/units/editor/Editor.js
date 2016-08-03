Ext.define('SparkRepositoryManager.view.units.editor.Editor', {
    extend: 'Ext.Panel',
    requires: [
        'SparkRepositoryManager.view.units.editor.Intro',
    ],
    xtype: 's2m-units-editor',

    componentCls: 's2m-units-navigator',

    padding: '10 0 0',
    bodyPadding: '5 21',
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
                    bodyPadding: '10 0',
                    items: [
                        {
                            xtype: 's2m-units-editor-intro'
                        },
                        {
                            title: 'Learn &amp; Practice'
                        },
                        {
                            title: 'Conference Questions'
                        },
                        {
                            title: 'Conference Resources'
                        },
                        {
                            title: 'Apply'
                        },
                        {
                            title: 'Assess'
                        }
                    ]
                }
            ]
        }
    ]
});