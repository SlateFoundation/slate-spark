Ext.define('SparkRepositoryManager.view.units.editor.Learn', {
    extend: 'Ext.Panel',
    xtype: 's2m-units-editor-learn',

    title: 'Learn &amp; Practice',
    componentCls: 's2m-units-editor-intro',

    items: [
        {
            xtype: 'multiselector',

            fieldName: 'title',
            fieldTitle: 'Learn Title',
            store: {
                fields: [
                    'sparkpoint',
                    'title',
                    'url',
                    {
                        name: 'required',
                        type: 'boolean',
                        defaultValue: false
                    },
                    {
                        name: 'recommended',
                        type: 'boolean',
                        defaultValue: false
                    }
                ],

                data: [
                    {
                        sparkpoint: 'SS.G6.1.2.A',
                        title: 'Genetic Drift',
                        url: 'http://example.com'
                    },
                    {
                        sparkpoint: 'SS.G6.1.2.A',
                        title: 'Learn Biology: Trophic Levels and Producer vs. Consumer',
                        url: 'http://example.com'
                    }
                ]
            }
        }
    ]
});