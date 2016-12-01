Ext.define('SparkRepositoryManager.view.lessons.editor.Apply', {
    extend: 'Ext.Panel',
    requires: [
        'SparkRepositoryManager.view.lessons.editor.Multiselector'
    ],
    xtype: 's2m-lessons-editor-apply',

    title: 'Apply',
    componentCls: 's2m-lessons-editor-apply',

    layout: 'fit',
    items: [
        {
            xtype: 's2m-lessons-multiselector',
            itemType: {
                singular: 'Apply',
                plural: 'Applies',
                field: 'applies'
            },
            allowMinimum: false,
            showRequired: false,
            showRecommended: false,
            lessonHeaderItems: [
                {
                    xtype: 'button',
                    text: 'Add Apply',
                    action: 'add-apply',
                    glyph: 0xf067 // fa-plus
                }
            ],

            sparkpointsStore: {
                xclass: 'SparkRepositoryManager.store.lesson.ApplyContent'

/*
                type: 'chained',
                source: 'ContentItems',
                groupField: 'sparkpointGroup',
                filters: [
                    function(item) {
                        return item.get('type') === 'apply';
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
*/
            },

            learnStore: {
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
