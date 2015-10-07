Ext.define('SparkClassroom.column.Link', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-link-column',

    config: {
        dataIndex: 'url',
        cls: 'spark-link-column',
        flex: 1,
        text: 'URL',
        tpl: '<a href="{url}">{url}</a>',
        cell: {
            encodeHtml: false
        }
    }
});
