Ext.define('SparkRepositoryManager.view.units.editor.Resources', {
    extend: 'Ext.Panel',
    requires: [
        'SparkRepositoryManager.view.units.editor.Multiselector'
    ],
    xtype: 's2m-units-editor-resources',

    title: 'Conference Resources',
    componentCls: 's2m-units-editor-resources',

    layout: 'fit',
    items: [
        {
            xtype: 's2m-units-multiselector',
            itemType: {
                singular: 'Resource',
                plural: 'Resources'
            },
            allowMinimum: false,
            showRequired: false,
            showRecommended: false,
            unitHeaderItems: [
                {
                    xtype: 'button',
                    text: 'Add Resource',
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
                        title: 'ASN Resource Page for SS.G6.1.2.B',
                        url: 'http://example.com/asn-resource'
                    },
                    {
                        sparkpoint: 'SS.G6.1.2.B',
                        title: 'Google Search Results',
                        url: 'http://example.com/google-results'
                    },
                    {
                        sparkpoint: 'SS.G6.2.4.A',
                        title: 'ASN Resource Page for SS.G6.2.4.A',
                        url: 'http://example.com/asn-resource'
                    },
                    {
                        sparkpoint: 'SS.G6.2.4.A',
                        title: 'Google Search Results',
                        url: 'http://example.com/google-results'
                    },
                    {
                        sparkpoint: 'SS.U.1.2.A',
                        title: 'Google Search Results',
                        url: 'http://example.com/google-results'
                    }
                ]
            },
            unitStore: {
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
                        title: 'ASN Resource Page for SS.G6.1.2.B',
                        url: 'http://example.com/asn-resource'
                    },
                    {
                        ordinal: 2,
                        title: 'ASN Resource Page for SS.G6.1.2.A',
                        url: 'http://example.com/asn-resource-2'
                    },
                    {
                        ordinal: 3,
                        title: 'ASN Resource Page for SS.G6.3.4.E',
                        url: 'http://example.com/asn-resource-3'
                    }
                ]
            }
        }
    ]
});