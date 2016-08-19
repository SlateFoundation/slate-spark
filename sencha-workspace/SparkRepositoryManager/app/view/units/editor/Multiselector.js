Ext.define('SparkRepositoryManager.view.units.editor.Multiselector', {
    extend: 'Ext.Container',
    xtype: 's2m-units-multiselector',

    componentCls: 's2m-units-multiselector',

    config: {
        itemType: {
            singular: 'Item',
            plural: 'Items'
        },
        sparkpointsStore: null,
        unitHeaderItems: null,
        unitStore: null,
        showRequired: false,
        showRecommended: false
    },

    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [
        {
            flex: 1,
            itemId: 'sparkpoints-grid',
            xtype: 'grid',
            features: [{
                ftype: 'grouping',
                groupHeaderTpl: '{name}',
                collapsible: false // disabled because it doesn't work TODO maybe make this work?,
            }],
            hideHeaders: true,
            disableSelection: true,
            emptyText: 'None available.',
            store: {
                fields: [],
                data: []
            },
            columns: [
                {
                    xtype: 'templatecolumn',
                    flex: 1,
                    cellWrap: true,
                    tpl: [
                        '<tpl if="url">',
                            '<a href="{url}" target="_blank">{title}</a>',
                        '<tpl else>',
                            '{title}',
                        '</tpl>'
                    ]
                },
                {
                    xtype: 'actioncolumn',
                    width: 24,
                    items: [
                        {
                            action: 'add',
                            iconCls: 'glyph-success',
                            tooltip: 'Add to Unit',
                            glyph: 0xf055 // fa-plus-circle
                        }
                    ]
                }
            ]
        },
        {
            flex: 2,
            itemId: 'unit-grid',
            xtype: 'grid',
            cls: 's2m-units-multiselector-unitgrid',
            features: [{
                ftype: 'grouping',
                groupHeaderTpl: '{name}',
                collapsible: false // disabled because it doesn't work TODO maybe make this work?,
            }],
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop'
                }
            },
            hideHeaders: true,
            emptyText: 'None yet. Add some from the Sparkpoints to the left, <br> or from scratch using the button above.',
            store: {
                fields: [],
                data: []
            },
            columns: {
                defaults: {
                    menuDisabled: true
                },
                items: [
                    {
                        width: 24,
                        xtype: 'actioncolumn',
                        align: 'right',
                        tdCls: 's2m-units-remove-cell',
                        items: [
                            {
                                action: 'remove',
                                iconCls: 'glyph-danger',
                                tooltip: 'Remove from Unit',
                                glyph: 0xf056 // fa-minus-circle
                            }
                        ]
                    },
                    {
                        width: 32,
                        xtype: 'rownumberer',
                        draggable: true // TODO does this work? interfere?
                    },
                    {
                        flex: 1,
                        xtype: 'templatecolumn',
                        itemId: 'unit-item-col',
                        cellWrap: true,
                        tpl: [
                            '<tpl if="url">',
                                '<a href="{url}" target="_blank">{title}</a>',
                            '<tpl else>',
                                '{title}',
                            '</tpl>'
                        ]
                    },
                    {
                        width: 80,
                        xtype: 'checkcolumn',
                        itemId: 'unit-required-column',
                        text: '<abbr title="Required">Req’d</abbr>',
                        dataIndex: 'isRequired',
                        hidden: true
                    },
                    {
                        width: 96,
                        xtype: 'checkcolumn',
                        itemId: 'unit-recommended-column',
                        text: '<abbr title="Recommended">Recm’d</abbr>',
                        dataIndex: 'isRecommended',
                        hidden: true
                    }
                ]
            }
        }
    ],

    afterRender: function() {
        var me = this,
            itemType = me.getItemType(),
            sparkpointsStore = me.getSparkpointsStore(),
            sparkpointsGrid = me.down('#sparkpoints-grid'),
            unitStore = me.getUnitStore(),
            unitGrid = me.down('#unit-grid'),
            unitHeaderItems = me.getUnitHeaderItems(),
            showRequired = me.getShowRequired(),
            showRecommended = me.getShowRecommended();

        me.callParent();

        sparkpointsGrid.setTitle(itemType.plural + ' in Sparkpoints')
        sparkpointsGrid.setStore(sparkpointsStore);

        unitGrid.setTitle(itemType.plural + ' in Unit');
        unitGrid.setStore(unitStore);
        unitGrid.down('#unit-item-col').setText(itemType.singular);

        if (unitHeaderItems) {
            unitGrid.getHeader().add(unitHeaderItems);
            unitGrid.getHeader().setStyle({
                height: '38px',
                padding: '6px 11px'
            });
        }

        if (showRequired || showRecommended) {
            unitGrid.hideHeaders = false;
            unitGrid.getHeaderContainer().setHeight('auto');

            unitGrid.down('#unit-required-column').setVisible(showRequired);
            unitGrid.down('#unit-recommended-column').setVisible(showRecommended);
        }
    }
});