Ext.define('SparkRepositoryManager.view.lessons.editor.Questions', {
    extend: 'Ext.Panel',
    xtype: 's2m-lessons-editor-questions',
    requires: [
        'SparkRepositoryManager.view.lessons.editor.Multiselector'
    ],


    title: 'Conference Questions',
    componentCls: 's2m-lessons-editor-questions',

    layout: 'fit',
    items: [
        {
            xtype: 's2m-lessons-multiselector',
            itemType: {
                singular: 'Question',
                plural: 'Questions',
                field: 'conference_questions'
            },
            allowMinimum: false,
            showRequired: false,
            showRecommended: false,
            lessonHeaderItems: [
                {
                    xtype: 'button',
                    text: 'Add Question',
                    action: 'add-question',
                    glyph: 0xf067 // fa-plus
                }
            ],

            sparkpointsStore: {
                xclass: 'SparkRepositoryManager.store.lesson.QuestionContent'

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
