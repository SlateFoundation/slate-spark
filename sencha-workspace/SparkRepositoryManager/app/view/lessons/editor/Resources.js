Ext.define('SparkRepositoryManager.view.lessons.editor.Resources', {
    extend: 'Ext.Panel',
    xtype: 's2m-lessons-editor-resources',
    requires: [
        'SparkRepositoryManager.view.lessons.editor.Multiselector'
    ],

    title: 'Conference Resources',
    componentCls: 's2m-lessons-editor-resources',

    layout: 'fit',
    items: [
        {
            xtype: 's2m-lessons-multiselector',
            itemType: {
                singular: 'Resource',
                plural: 'Resources',
                field: 'conference_resources'
            },
            allowMinimum: false,
            showRequired: false,
            showRecommended: false,
            lessonHeaderItems: [
                {
                    xtype: 'button',
                    text: 'Add Resource',
                    action: 'add-resource',
                    glyph: 0xf067 // fa-plus
                }
            ],

            sparkpointsStore: {
                xclass: 'SparkRepositoryManager.store.lesson.ResourceContent'

/*
                type: 'chained',
                source: 'ContentItems',
                groupField: 'sparkpointGroup',
                filters: [
                    function(item) {
                        return item.get('type') === 'conference_resource';
                    }
                ]

*/
            },

            lessonStore: {
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
