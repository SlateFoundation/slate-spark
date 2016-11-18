Ext.define('SparkRepositoryManager.view.modules.editor.Questions', {
    extend: 'Ext.Panel',
    requires: [
        'SparkRepositoryManager.view.modules.editor.Multiselector'
    ],
    xtype: 's2m-modules-editor-questions',

    title: 'Conference Questions',
    componentCls: 's2m-modules-editor-questions',

    layout: 'fit',
    items: [
        {
            xtype: 's2m-modules-multiselector',
            itemType: {
                singular: 'Question',
                plural: 'Questions',
                field: 'conference_questions'
            },
            allowMinimum: false,
            showRequired: false,
            showRecommended: false,
            moduleHeaderItems: [
                {
                    xtype: 'button',
                    text: 'Add Question',
                    action: 'add-question',
                    glyph: 0xf067 // fa-plus
                }
            ],

            sparkpointsStore: {
                xclass: 'SparkRepositoryManager.store.module.QuestionContent'

/*
                type: 'chained',
                source: 'ContentItems',
                groupField: 'sparkpointGroup',
                remoteFilter: false,
                filters: [
                    function(item) {
                        return item.get('type') === 'guiding_question';
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
            }
        }
    ]
});
