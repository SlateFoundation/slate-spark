Ext.define('SparkRepositoryManager.view.units.editor.Editor', {
    extend: 'Ext.Container',
    requires: [
        'SparkRepositoryManager.units.editor.Intro'
    ],
    xtype: 's2m-units-editor',

    componentCls: 's2m-units-navigator',

    padding: '25 50',
    items: [
        {
            xtype: 'form',
            items: [
                {
                    xtype: 'container',
                    cls: 's2m-units-editor-meta',
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
                            width: 200,
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
                    xtype: 'container',
                    layout: 'hbox',
                    margin: '10 0 25',
                    items: [
                        {
                            width: 200,
                            xtype: 'checkbox',
                            boxLabel: 'Share unit to global database'
                        },
                        {
                            xtype: 'combo',
                            fieldLabel: 'Clone Existing Unit',
                            labelWidth: 130,
                            margin: '0 0 0 20'
                        }
                    ]
                },
                {
                    xtype: 'tabpanel',
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