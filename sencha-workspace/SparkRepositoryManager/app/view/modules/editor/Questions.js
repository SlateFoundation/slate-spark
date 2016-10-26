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
                plural: 'Questions'
            },
            allowMinimum: false,
            showRequired: false,
            showRecommended: false,
            moduleHeaderItems: [
                {
                    xtype: 'button',
                    text: 'Add Question',
                    glyph: 0xf067 // fa-plus
                }
            ],

            sparkpointsStore: {
                fields: [
                    'sparkpoint',
                    'title'
                ],
                groupField: 'sparkpoint',
                data: [
                    {
                        sparkpoint: 'SS.G6.1.2.A',
                        title: 'What are some practical ways to explain this?'
                    },
                    {
                        sparkpoint: 'SS.G6.1.2.A',
                        title: 'How would you explain this Sparkpoint to an alien?'
                    },
                    {
                        sparkpoint: 'SS.G6.1.2.A',
                        title: 'How much time do you spend each week using this skill?'
                    },
                    {
                        sparkpoint: 'SS.G6.2.4.A',
                        title: 'What are some practical ways to explain this?'
                    },
                    {
                        sparkpoint: 'SS.G6.2.4.A',
                        title: 'How would you explain this Sparkpoint to an alien?'
                    },
                    {
                        sparkpoint: 'SS.G6.2.4.A',
                        title: 'How much time do you spend each week using this skill?'
                    },
                    {
                        sparkpoint: 'SS.U.1.2.A',
                        title: 'What are some practical ways to explain this?'
                    },
                    {
                        sparkpoint: 'SS.U.1.2.A',
                        title: 'How would you explain this Sparkpoint to an alien?'
                    },
                    {
                        sparkpoint: 'SS.U.1.2.A',
                        title: 'How much time do you spend each week using this skill?'
                    }
                ]
            }
        }
    ]
});
