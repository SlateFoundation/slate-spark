Ext.define('SparkClassroom.column.URL', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-url-column',

    config: {
        dataIndex: 'url',
        cls: 'spark-url-column',
        flex: 1,
        text: 'URL',
        tpl: '<a href="{url}">{url}</a>',
        cell: {
            encodeHtml: false
        }
    }
});
