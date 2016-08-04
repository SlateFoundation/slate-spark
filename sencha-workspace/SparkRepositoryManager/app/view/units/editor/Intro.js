Ext.define('SparkRepositoryManager.view.units.editor.Intro', {
    extend: 'Ext.Panel',
    xtype: 's2m-units-editor-intro',

    title: 'Intro',
    componentCls: 's2m-units-editor-intro',

    items: [
        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            margin: '10',
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
                            html: 'Add Sparkpoints to this unit and check off any that will be evaluated.'
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
                                    xtype: 'combo'
                                },
                                {
                                    xtype: 'button',
                                    text: 'Add',
                                    scale: 'small',
                                    margin: '2 0 0 5',
                                    action: 'add-sparkpoint',
                                    // TODO offload to controller?
                                    listeners: {
                                        click: function(btn) {
                                            // TODO add an actual blank item? some way to search for a sparkpoint?
                                            btn
                                                .up('s2m-units-editor-intro')
                                                .down('#sparkpoint-grid')
                                                .getStore()
                                                .add({
                                                    code: 'SS.G6.3.5.B',
                                                    willBeEvaluated: false
                                                });
                                        }
                                    }
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
                                    var grid = this.up('s2m-units-editor-intro').down('#sparkpoint-grid'),
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
                    cls: 's2m-units-intro-list',
                    emptyText: 'No Sparkpoints in this unit.',
                    hideHeaders: true,
                    store: {
                        fields: ['code', 'willBeEvaluated'],
                        data: [
                            { code: 'SS.G6.1.2.A', willBeEvaluated: false },
                            { code: 'SS.G6.2.4.A', willBeEvaluated: true },
                            { code: 'ELA.G6.RI.1', willBeEvaluated: false },
                            { code: 'ELA.G6.RI.2', willBeEvaluated: true },
                            { code: 'ELA.G6.RI.3', willBeEvaluated: true },
                            { code: 'ELA.G6.RI.4', willBeEvaluated: true },
                            { code: 'ELA.G6.RI.6', willBeEvaluated: true },
                            { code: 'ELA.G6.RI.5', willBeEvaluated: false },
                            { code: 'ELA.G6.RI.7', willBeEvaluated: true },
                            { code: 'ELA.G6.RI.8', willBeEvaluated: false }
                        ]
                    },
                    columns: {
                        defaults: {
                            menuDisabled: true,
                            sortable: false
                        },
                        items: [
                            {
                                text: 'Sparkpoints in unit',
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
                            this.up('s2m-units-editor-intro').down('button[action="remove-sparkpoint"]').setDisabled(!(records.length > 0));
                        }
                    }
                },
                {
                    flex: 1,
                    maxWidth: 480,
                    xtype: 'container',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    margin: '0 0 0 20',
                    padding: '0 0 0 40',
                    style: {
                        borderLeft: '1px solid #ccc'
                    },
                    items: [
                        {
                            xtype: 'fieldcontainer',
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
                                }
                            },
                            items: [
                                {
                                    fieldLabel: 'L&amp;P'
                                },
                                {
                                    fieldLabel: 'C'
                                },
                                {
                                    fieldLabel: 'Ap'
                                },
                                {
                                    fieldLabel: 'As'
                                },
                                {
                                    fieldLabel: 'Total',
                                    margin: 0
                                }
                            ]
                        },
                        {
                            xtype: 'textarea',
                            fieldLabel: 'Directions',
                            labelAlign: 'top',
                            labelSeparator: '',
                            height: 160,
                            margin: '40 0' // TODO why is extra margin needed?
                        }
                    ]
                }
            ]
        }
    ]
});