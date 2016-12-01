Ext.define('SparkRepositoryManager.view.lessons.editor.Multiselector', {
    extend: 'Ext.Container',
    xtype: 's2m-lessons-multiselector',

    componentCls: 's2m-lessons-multiselector',

    config: {
        itemType: {
            singular: 'Item',
            plural: 'Items'
        },
        sparkpointsStore: null,
        lessonHeaderItems: null,
        lessonStore: null,
        showRequired: false,
        showRecommended: false,
        hideHeaders: true
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
            columns: [
                {
                    xtype: 'templatecolumn',
                    flex: 1,
                    cellWrap: true,
                    tpl: [
                        '<tpl if="url">',
                            '<a href="{url}" target="_blank">{title}</a>',
                        '<tpl elseif="question">',
                            '{question}',
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
                            tooltip: 'Add to Lesson',
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
                    itemId: 'lesson-grid',
                    xtype: 'grid',
                    cls: 's2m-lessons-multiselector-lessongrid',
                    features: [{
                        ftype: 'grouping',
                        groupHeaderTpl: '{name}',
                        collapsible: false // disabled because it doesn't work TODO maybe make this work?,
                    }],
                    viewConfig: {
                        plugins: {
                            ptype: 'gridviewdragdrop'
                        },
                        getRowClass: function(rec) {
                            // TODO : hide dummy records
                            // return '';
                            return rec.get('fusebox_id') === -1 ? 'x-hidden' : '';
                        }
                    },
                    hideHeaders: false,
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
                                tdCls: 's2m-lessons-remove-cell',
                                items: [
                                    {
                                        action: 'remove',
                                        iconCls: 'glyph-danger',
                                        tooltip: 'Remove from Lesson',
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
                                itemId: 'lesson-item-col',
                                cellWrap: true,
                                tpl: [
                                    '<tpl if="url">',
                                        '<a href="{url}" target="_blank">{title}</a>',
                                    '<tpl elseif="question">',
                                        '{question}',
                                    '<tpl else>',
                                        '{title}',
                                    '</tpl>'
                                ]
                            },
                            {
                                width: 48,
                                xtype: 'checkcolumn',
                                itemId: 'lesson-required-column',
                                // text: '<abbr title="Required">Req’d</abbr>',
                                text: '<i class="fa fa-asterisk"></i>',
                                dataIndex: 'isRequired',
                                hidden: true
                            },
                            {
                                width: 48,
                                xtype: 'checkcolumn',
                                itemId: 'lesson-recommended-column',
                                // text: '<abbr title="Recommended">Recm’d</abbr>',
                                text: '<i class="fa fa-bookmark"></i>',
                                dataIndex: 'isRecommended',
                                hidden: true
                            }
                        ]
                    }
                },
                {
                    xtype: 'component',
                    cls: 's2m-lessons-multiselector-legend',
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
            lessonStore = me.getLessonStore(),
            lessonGrid = me.down('#lesson-grid'),
            lessonHeaderItems = me.getlessonHeaderItems(),
            showRequired = me.getShowRequired(),
            showRecommended = me.getShowRecommended(),
            hideHeaders = me.getHideHeaders();

        me.callParent();

        sparkpointsGrid.setTitle(itemType.plural + ' in Sparkpoints')
        sparkpointsGrid.setStore(sparkpointsStore);
        sparkpointsGrid.on({
            addclick: Ext.bind(me.addSparkpointClick, me)
        });

        lessonGrid.setTitle(itemType.plural + ' in Lesson');
        lessonGrid.setStore(lessonStore);

        // commenting this out.  Only learns shows the header anyway, and with the title above, the column header seems redundant
        // lessonGrid.down('#lesson-item-col').setText(itemType.singular);

        lessonGrid.on({
            removeclick: Ext.bind(me.removeSparkpointClick, me)
        });
        lessonGrid.getView().on({
            beforedrop: Ext.bind(me.updateGroupField, me)
        });

        if (lessonHeaderItems) {
            lessonGrid.getHeader().add(lessonHeaderItems);
            lessonGrid.getHeader().setStyle({
                height: '38px',
                padding: '6px 11px'
            });
        }

        if (showRequired || showRecommended) {
            lessonGrid.down('#lesson-required-column').setVisible(showRequired);
            lessonGrid.down('#lesson-recommended-column').setVisible(showRecommended);
            me.down('#legend').show();
        }

        // grid header setVisible workaround, see: https://www.sencha.com/forum/showthread.php?259472-Hide-tree-grid-header-row-at-runtime
        lessonGrid.getView().getHeaderCt().setHeight(hideHeaders ? 0 : null);
    },


    // event handlers
    addSparkpointClick: function(grid, rec) {
        var me = this,
            sparkpointsStore = me.down('#sparkpoints-grid').getStore(),
            lessonStore = me.down('#lesson-grid').getStore();

        if (lessonStore.isGrouped()) {
            lessonStore.suspendEvents();
            lessonStore.add(Ext.apply(rec.getData(), { lessongroup: 'Group 1' }));
            lessonStore.resumeEvents();
            lessonStore.group(lessonStore.getGroupField());
        } else {
            lessonStore.add(rec.getData());
        }

        sparkpointsStore.filterBy(function(sparkpointRec) {
            return lessonStore.findExact('fusebox_id', sparkpointRec.get('fusebox_id')) === -1;
        });
    },

    removeSparkpointClick: function(grid, rec) {
        var me = this,
            sparkpointsStore = me.down('#sparkpoints-grid').getStore(),
            lessonStore = me.down('#lesson-grid').getStore();

        if (lessonStore.isGrouped()) {
            lessonStore.suspendEvents();
            lessonStore.remove(rec);
            lessonStore.resumeEvents();
            lessonStore.group(lessonStore.getGroupField());
        } else {
            lessonStore.remove(rec);
        }

        sparkpointsStore.filterBy(function(sparkpointRec) {
            return lessonStore.findExact('fusebox_id', sparkpointRec.get('fusebox_id')) === -1;
        });
    },

    updateGroupField: function(node, data, overModel) {
        var rec = data.records[0],
            group = overModel.get('lessongroup');

        rec.set('lessongroup', group);
    }

})
