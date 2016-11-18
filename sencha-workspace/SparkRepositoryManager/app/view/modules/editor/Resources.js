Ext.define('SparkRepositoryManager.view.modules.editor.Resources', {
    extend: 'Ext.Panel',
    xtype: 's2m-modules-editor-resources',
    requires: [
        'SparkRepositoryManager.view.modules.editor.Multiselector'
    ],

    title: 'Conference Resources',
    componentCls: 's2m-modules-editor-resources',

    layout: 'fit',
    items: [
        {
            xtype: 's2m-modules-multiselector',
            itemType: {
                singular: 'Resource',
                plural: 'Resources',
                field: 'conference_resources'
            },
            allowMinimum: false,
            showRequired: false,
            showRecommended: false,
            moduleHeaderItems: [
                {
                    xtype: 'button',
                    text: 'Add Resource',
                    action: 'add-resource',
                    glyph: 0xf067 // fa-plus
                }
            ],

            sparkpointsStore: {
                type: 'chained',
                source: 'ContentItems',
                groupField: 'sparkpointGroup',
                filters: [
                    function(item) {
                        return item.get('type') === 'conference_resource';
                    }
                ],
                listeners: {
                    refresh: function(store) {
                        var filters = store.getFilters().getRange();

                        store.suspendEvents();
                        store.clearFilter(true);
                        store.addFilter(filters);
                        store.resumeEvents();
                    }
                }
            },

            moduleStore: {
                fields: [
                    {
                        name: 'ordinal',
                        type: 'integer'
                    },
                    'title'
                ]
            }
        }
    ]
});
