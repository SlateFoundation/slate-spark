Ext.define('SparkRepositoryManager.view.modules.editor.Multiselector', {
    extend: 'Ext.Container',
    xtype: 's2m-modules-multiselector',

    componentCls: 's2m-modules-multiselector',

    config: {
        itemType: {
            singular: 'Item',
            plural: 'Items'
        },
        sparkpointsStore: null,
        moduleHeaderItems: null,
        moduleStore: null,
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
                            tooltip: 'Add to Module',
                            glyph: 0xf055 // fa-plus-circle
                        }
                    ]
                }
            ]
        },
        {
            flex: 2,
            xtype: 'container',
            margin: '0 0 0 20',
            items: [
                {
                    itemId: 'module-grid',
                    xtype: 'grid',
                    cls: 's2m-modules-multiselector-modulegrid',
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
                                tdCls: 's2m-modules-remove-cell',
                                items: [
                                    {
                                        action: 'remove',
                                        iconCls: 'glyph-danger',
                                        tooltip: 'Remove from Module',
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
                                itemId: 'module-item-col',
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
                                width: 48,
                                xtype: 'checkcolumn',
                                itemId: 'module-required-column',
                                text: '<abbr title="Required">Req’d</abbr>',
                                dataIndex: 'isRequired',
                                hidden: true
                            },
                            {
                                width: 48,
                                xtype: 'checkcolumn',
                                itemId: 'module-recommended-column',
                                text: '<abbr title="Recommended">Recm’d</abbr>',
                                dataIndex: 'isRecommended',
                                hidden: true
                            }
                        ]
                    }
                },
                {
                    xtype: 'component',
                    cls: 's2m-modules-multiselector-legend',
                    itemId: 'legend',
                    hidden: true,
                    html: [
                        '<i class="fa fa-asterisk"></i> Required ',
                        '&emsp;',
                        '<i class="fa fa-bookmark"></i> Recommended'
                    ]
                }
            ]
        }
    ],


    afterRender: function() {
        var me = this,
            itemType = me.getItemType(),
            sparkpointsStore = me.getSparkpointsStore(),
            sparkpointsGrid = me.down('#sparkpoints-grid'),
            moduleStore = me.getModuleStore(),
            moduleGrid = me.down('#module-grid'),
            moduleHeaderItems = me.getModuleHeaderItems(),
            showRequired = me.getShowRequired(),
            showRecommended = me.getShowRecommended();

        me.callParent();

        sparkpointsGrid.setTitle(itemType.plural + ' in Sparkpoints')
        sparkpointsGrid.setStore(sparkpointsStore);
        sparkpointsGrid.on({
            addclick: Ext.bind(me.addSparkpointClick, me)
        });

        moduleGrid.setTitle(itemType.plural + ' in Module');
        moduleGrid.setStore(moduleStore);
        moduleGrid.down('#module-item-col').setText(itemType.singular);
        moduleGrid.on({
            removeclick: Ext.bind(me.removeSparkpointClick, me)
        });

        if (moduleHeaderItems) {
            moduleGrid.getHeader().add(moduleHeaderItems);
            moduleGrid.getHeader().setStyle({
                height: '38px',
                padding: '6px 11px'
            });
        }

        if (showRequired || showRecommended) {
            moduleGrid.down('#module-required-column').setVisible(showRequired);
            moduleGrid.down('#module-recommended-column').setVisible(showRecommended);
            me.down('#legend').show();
        }
    },


    // event handlers
    addSparkpointClick: function(grid, rec) {
        var me = this,
            sparkpointsStore = me.down('#sparkpoints-grid').getStore(),
            moduleStore = me.down('#module-grid').getStore();

        moduleStore.add(rec);

        sparkpointsStore.filterBy(function(sparkpointRec) {
            return moduleStore.indexOf(sparkpointRec) === -1;
        });
    },

    removeSparkpointClick: function(grid, rec) {
        var me = this,
            sparkpointsStore = me.down('#sparkpoints-grid').getStore(),
            moduleStore = me.down('#module-grid').getStore();

        moduleStore.remove(rec);

        sparkpointsStore.filterBy(function(sparkpointRec) {
            return moduleStore.indexOf(sparkpointRec) === -1;
        });
    }
});
