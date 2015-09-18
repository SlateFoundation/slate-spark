Ext.define('SparkClassroom.column.Link', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-link-column',

    config: {
        cls: 'spark-link-column',
        flex: 1,
        text: 'URL',
        tpl: '<a href="{Link}">{Link}</a>',
        cell: {
            encodeHtml: false
        }
    }
});
