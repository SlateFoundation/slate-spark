Ext.define('SparkRepositoryManager.view.modules.editor.Intro', {
    extend: 'Ext.Panel',
    xtype: 's2m-modules-editor-intro',

    title: 'Intro',
    componentCls: 's2m-modules-editor-intro',

    items: [
        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                {
                    width: 256,
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'component',
                            styleHtmlContent: true,
                            style: {
                                fontSize: '1.125em',
                                lineHeight: 4/3
                            },
                            html: 'Add Sparkpoints to this module and check off any that will be evaluated.'
                        },
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: 'Add a Sparkpoint',
                            labelAlign: 'top',
                            labelSeparator: '',
                            layout: 'hbox',
                            margin: '10 0',
                            items: [
                                {
                                    name: 'sparkpoints',
                                    xtype: 'combo',
                                    queryMode: 'local',
                                    displayField: 'code',
                                    valueField: 'code',
                                    store: {
                                        xclass: 'SparkRepositoryManager.store.sparkpoints.Lookup'
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: 'Add',
                                    action: 'add-sparkpoint',
                                    scale: 'small',
                                    margin: '2 0 0 5'
                                }
                            ]
                        },
                        {
                            xtype: 'button',
                            text: 'Remove Selected',
                            ui: 'normal',
                            action: 'remove-sparkpoint',
                            disabled: true,
                            margin: '30 0',
                            // TODO offload to controller?
                            listeners: {
                                click: function() {
                                    var grid = this.up('s2m-modules-editor-intro').down('#sparkpoint-grid'),
                                        selection = grid.getSelection(),
                                        store = grid.getStore();

                                    store.remove(selection);
                                }
                            }
                        }
                    ]
                },
                {
                    width: 192,
                    itemId: 'sparkpoint-grid',
                    margin: '0 20',
                    xtype: 'grid',
                    cls: 's2m-modules-intro-list',
                    emptyText: 'No Sparkpoints in this module.',
                    hideHeaders: true,
                    store: {
                        fields: ['id', 'code', 'willBeEvaluated']
                    },
                    columns: {
                        defaults: {
                            menuDisabled: true,
                            sortable: false
                        },
                        items: [
                            {
                                text: 'Sparkpoints in module',
                                dataIndex: 'code',
                                flex: 1
                            },
                            {
                                xtype: 'checkcolumn',
                                text: 'Evaluated',
                                dataIndex: 'willBeEvaluated',
                                width: 40
                            }
                        ]
                    },
                    allowDeselect: true,
                    selModel: {
                        mode: 'MULTI'
                    },
                    viewConfig: {
                        plugins: {
                            // TODO we need to store the order somehow for this to be useful
                            // if that's not feasible, probably remove this plugin
                            ptype: 'gridviewdragdrop',
                            dragText: 'Drag and drop to reorganize'
                        }
                    },
                    // TODO offload to controller?
                    listeners: {
                        selectionchange: function(model, records) {
                            this.up('s2m-modules-editor-intro').down('button[action="remove-sparkpoint"]').setDisabled(!(records.length > 0));
                        }
                    }
                },
                {
                    flex: 1,
                    maxWidth: 480,
                    cls: 'split-left',
                    xtype: 'container',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            itemId: 'phase_start',
                            fieldLabel: 'Day each phase should start',
                            labelAlign: 'top',
                            layout: 'hbox',
                            width: '100%',
                            defaults: {
                                xtype: 'textfield',
                                flex: 1,
                                margin: '0 10 0 0',
                                fieldStyle: 'text-align: center',
                                labelAlign: 'top',
                                labelSeparator: '',
                                labelStyle: 'font-size: 1em; text-transform: none',
                                style: {
                                    textAlign: 'center'
                                },
                                checkChangeEvents: ['blur']
                            },
                            items: [
                                {
                                    fieldLabel: 'L&amp;P',
                                    name: 'LP'
                                },
                                {
                                    fieldLabel: 'C',
                                    name: 'C'
                                },
                                {
                                    fieldLabel: 'Ap',
                                    name: 'Ap'
                                },
                                {
                                    fieldLabel: 'As',
                                    name: 'As'
                                },
                                {
                                    fieldLabel: 'Total',
                                    name: 'Total',
                                    margin: 0
                                }
                            ]
                        },
                        {
                            xtype: 'textarea',
                            name: 'directions',
                            fieldLabel: 'Directions',
                            labelAlign: 'top',
                            labelSeparator: '',
                            height: 160,
                            margin: '40 0', // TODO why is extra margin needed?
                            checkChangeEvents: ['blur']
                        }
                    ]
                }
            ]
        }
    ]
});
