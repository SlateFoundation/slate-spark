Ext.define('SparkClassroom.column.Title', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-title-column',

    config: {
        cls: 'spark-title-column',
        flex: 2,
        dataIndex: 'title',
        cell: {
            encodeHtml: false
        },
        tpl: [
            '<tpl if="thumbnail">',
                '<img src="{thumbnail:htmlEncode}" height="26"> ',
            '</tpl>',

            '<tpl if="url">',
                '<a href="{url:htmlEncode}" target="_blank">',
            '</tpl>',

            '{title}',

            '<tpl if="url">',
                '</a>',
            '</tpl>'
        ]
    }
});