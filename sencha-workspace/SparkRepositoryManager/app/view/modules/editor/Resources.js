Ext.define('SparkRepositoryManager.view.modules.editor.Resources', {
    extend: 'Ext.Panel',
    xtype: 's2m-modules-editor-resources',
    requires: [
        'SparkRepositoryManager.view.modules.editor.Multiselector'
    ],

    title: 'Conference Resources',
    componentCls: 's2m-modules-editor-resources',

    layout: 'fit',
    items: [
        {
            xtype: 's2m-modules-multiselector',
            itemType: {
                singular: 'Resource',
                plural: 'Resources',
                field: 'conference_resources'
            },
            allowMinimum: false,
            showRequired: false,
            showRecommended: false,
            moduleHeaderItems: [
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
