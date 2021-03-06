Ext.define('SparkRepositoryManager.view.lessons.editor.Learn', {
    extend: 'Ext.Panel',
    xtype: 's2m-lessons-editor-learn',
    requires: [
        'SparkRepositoryManager.view.lessons.editor.Multiselector'
    ],


    title: 'Learn &amp; Practice',
    componentCls: 's2m-lessons-editor-learn',

    layout: 'fit',
    items: [
        {
            xtype: 's2m-lessons-multiselector',
            itemType: {
                singular: 'Learn',
                plural: 'Learns',
                field: 'learns'
            },
            allowMinimum: true,
            showRequired: true,
            showRecommended: true,
            hideHeaders: false,
            lessonHeaderItems: [
                {
                    xtype: 'textfield',
                    fieldLabel: 'Learns Needed',
                    name: 'learns_required',
                    labelWidth: 120,
                    width: 161,
                    inputAttrTpl: 'pattern="[0-9]*"',
                    maskRe: /[0-9]/,
                    maxLength: 3,
                    enforceMaxLength: true,
                    emptyText: '0',
                    checkChangeEvents: ['blur'],
                    fieldStyle: {
                        textAlign: 'center'
                    }
                },
                {
                    xtype: 'button',
                    text: 'Add Learn',
                    action: 'add-learn',
                    margin: '0 10 0 20',
                    glyph: 0xf067 // fa-plus
                },
                {
                    xtype: 'button',
                    text: 'Add Group',
                    action: 'add-learn-group',
                    glyph: 0xf07b // fa-folder-open
                }
            ],

            sparkpointsStore: {
                xclass: 'SparkRepositoryManager.store.lesson.LearnContent'

/*
                type: 'chained',
                source: 'ContentItems',
                groupField: 'sparkpointGroup',
                filters: [
                    function(item) {
                        return item.get('type') === 'learn';
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

            lessonStore: {
                groupField: 'lessongroup',
                fields: [
                    {
                        name: 'ordinal',
                        type: 'integer'
                    },
                    {
                        name: 'lessongroup',
                        defaultValue: 'Group 1'
                    },
                    'title',
                    'url',
                    {
                        name: 'isRequired',
                        type: 'boolean'
                    },
                    {
                        name: 'isRecommended',
                        type: 'boolean'
                    }
                ]
// TODO: Remove test data

/*
                data: [
                    {
                        ordinal: 1,
                        title: 'What’s Eating You: Producers, Consumers, Decomposers',
                        url: 'http://example.com/eating',
                        isRecommended: true
                    },
                    {
                        ordinal: 2,
                        title: 'History of Prokaryotic and Eukaryotic Cells',
                        url: 'http://example.com/history',
                        isRequired: true
                    },
                    {
                        ordinal: 3,
                        title: 'Speciation: Of Ligers and Men — Crash Course Biology #15',
                        url: 'http://example.com/speciation'
                    }
                ]
*/
            }
        }
    ]
});
