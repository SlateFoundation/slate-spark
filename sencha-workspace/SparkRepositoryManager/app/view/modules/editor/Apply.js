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
                    glyph: 0xf067 // fa-plus
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
                        sparkpoint: 'SS.G6.1.2.B',
                        title: 'Our Baby Dragon',
                        url: 'http://example.com/dragon'
                    },
                    {
                        sparkpoint: 'SS.G6.1.2.B',
                        title: 'Make Your Predictions',
                        url: 'http://example.com/predictions'
                    },
                    {
                        sparkpoint: 'SS.G6.2.4.A',
                        title: 'Beak Shape Matters',
                        url: 'http://example.com/beak-shape'
                    },
                    {
                        sparkpoint: 'SS.G6.2.4.A',
                        title: 'Claw Matters',
                        url: 'http://example.com/claw-matters'
                    },
                    {
                        sparkpoint: 'SS.U.1.2.A',
                        title: 'Ticket to Ride',
                        url: 'http://example.com/ticket-ride'
                    },
                    {
                        sparkpoint: 'SS.U.1.2.A',
                        title: 'Music Store Hours',
                        url: 'http://example.com/music-store'
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
                ],
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
            }
        }
    ]
});
