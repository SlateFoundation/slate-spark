Ext.define('SparkRepositoryManager.view.modules.editor.Learn', {
    extend: 'Ext.Panel',
    requires: [
        'SparkRepositoryManager.view.modules.editor.Multiselector'
    ],
    xtype: 's2m-modules-editor-learn',

    title: 'Learn &amp; Practice',
    componentCls: 's2m-modules-editor-learn',

    layout: 'fit',
    items: [
        {
            xtype: 's2m-modules-multiselector',
            itemType: {
                singular: 'Learn',
                plural: 'Learns',
                field: 'learns'
            },
            allowMinimum: true,
            showRequired: true,
            showRecommended: true,
            moduleHeaderItems: [
                {
                    xtype: 'textfield',
                    fieldLabel: 'Min. Learns Needed',
                    labelWidth: 120,
                    width: 161,
                    inputAttrTpl: 'pattern="[0-9]*"',
                    maskRe: /[0-9]/,
                    maxLength: 3,
                    enforceMaxLength: true,
                    emptyText: '0',
                    fieldStyle: {
                        textAlign: 'center'
                    }
                },
                {
                    xtype: 'button',
                    text: 'Add Learn',
                    margin: '0 10 0 20',
                    glyph: 0xf067 // fa-plus
                },
                {
                    xtype: 'button',
                    text: 'Add Group',
                    glyph: 0xf07b // fa-folder-open
                }
            ],

            sparkpointsStore: {
                fields: [
                    'sparkpoint',
                    'title',
                    'url'
                ],
                groupField: 'sparkpoint',
                data: [
                    {
                        sparkpoint: 'SS.G6.1.2.A',
                        title: 'Genetic Drift',
                        url: 'http://example.com/genetic'
                    },
                    {
                        sparkpoint: 'SS.G6.1.2.A',
                        title: 'Learn Biology: Trophic Levels and Producer vs. Consumer',
                        url: 'http://example.com/learn'
                    },
                    {
                        sparkpoint: 'SS.G6.1.2.A',
                        title: 'Symbiosis: A surprising tale of species cooperation - David Gonzales',
                        url: 'http://example.com/symbiosis'
                    },
                    {
                        sparkpoint: 'SS.G6.1.2.A',
                        title: 'In Hardy-Weinberg equilibrium',
                        url: 'http://example.com/hardy'
                    },
                    {
                        sparkpoint: 'SS.G6.2.4.A',
                        title: 'Genetic Drift',
                        url: 'http://example.com/genetic'
                    },
                    {
                        sparkpoint: 'SS.G6.2.4.A',
                        title: 'Learn Biology: Trophic Levels and Producer vs. Consumer',
                        url: 'http://example.com/learn'
                    },
                    {
                        sparkpoint: 'SS.G6.2.4.A',
                        title: 'Symbiosis: A surprising tale of species cooperation - David Gonzales',
                        url: 'http://example.com/symbiosis'
                    },
                    {
                        sparkpoint: 'SS.G6.2.4.A',
                        title: 'In Hardy-Weinberg equilibrium',
                        url: 'http://example.com/hardy'
                    },
                    {
                        sparkpoint: 'SS.U.1.2.A',
                        title: 'Genetic Drift',
                        url: 'http://example.com/genetic'
                    },
                    {
                        sparkpoint: 'SS.U.1.2.A',
                        title: 'Learn Biology: Trophic Levels and Producer vs. Consumer',
                        url: 'http://example.com/learn'
                    },
                    {
                        sparkpoint: 'SS.G6.1.2.B',
                        title: 'Genetic Drift',
                        url: 'http://example.com/genetic'
                    },
                    {
                        sparkpoint: 'SS.G6.1.2.B',
                        title: 'Learn Biology: Trophic Levels and Producer vs. Consumer',
                        url: 'http://example.com/learn'
                    },
                    {
                        sparkpoint: 'SS.G6.1.2.B',
                        title: 'Symbiosis: A surprising tale of species cooperation - David Gonzales',
                        url: 'http://example.com/symbiosis'
                    }
                ]
            },
            moduleStore: {
                groupField: 'group',
                fields: [
                    {
                        name: 'ordinal',
                        type: 'integer'
                    },
                    {
                        name: 'group',
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
                ],
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
            }
        }
    ]
});
