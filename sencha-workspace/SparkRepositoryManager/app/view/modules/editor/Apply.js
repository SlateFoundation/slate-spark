Ext.define('SparkRepositoryManager.view.modules.editor.Apply', {
    extend: 'Ext.Panel',
    requires: [
        'SparkRepositoryManager.view.modules.editor.Multiselector'
    ],
    xtype: 's2m-modules-editor-apply',

    title: 'Apply',
    componentCls: 's2m-modules-editor-apply',

    layout: 'fit',
    items: [
        {
            xtype: 's2m-modules-multiselector',
            itemType: {
                singular: 'Apply',
                plural: 'Applies',
                field: 'applies'
            },
            allowMinimum: false,
            showRequired: false,
            showRecommended: false,
            moduleHeaderItems: [
                {
                    xtype: 'button',
                    text: 'Add Apply',
                    action: 'add-apply',
                    glyph: 0xf067 // fa-plus
                }
            ],

            sparkpointsStore: {
                type: 'chained',
                source: 'ContentItems',
                // groupField: 'sparkpointGroup',
                filters: [
                    function(item) {
                        return item.get('type') === 'apply';
                    }
                ]
            },

            moduleStore: {
                fields: [
                    {
                        name: 'ordinal',
                        type: 'integer'
                    },
                    'title'
                ]

// TODO: Remove test data

/*
                data: [
                    {
                        ordinal: 1,
                        title: 'Mission Matters',
                        url: 'http://example.com/mission'
                    },
                    {
                        ordinal: 2,
                        title: 'Planet Facts',
                        url: 'http://example.com/planets'
                    },
                    {
                        ordinal: 3,
                        title: 'The Key Points of Natural Selection',
                        url: 'http://example.com/darwin'
                    }
                ]
*/
            }
        }
    ]
});
