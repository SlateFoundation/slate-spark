Ext.define('SparkClassroom.column.Link', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-link-column',

    config: {
        cls: 'spark-link-column',
        flex: 1,
        dataIndex: 'title',
        text: 'Link',
        cell: {
            encodeHtml: false
        },
        tpl: [
            '<div',
                ' class="spark-grid-row-image"',
                ' title="{vendor:htmlEncode}"',
                '<tpl if="thumbnail">',
                    ' style="background-image:url({thumbnail:htmlEncode})"',
                '</tpl>',
            '>',
                '{vendor:htmlEncode}',
            '</div>',
            '<div class="spark-grid-row-title">{title:htmlEncode}</div>',
            '<div class="spark-grid-row-detail"><a href="{url:htmlEncode}" title="{title:htmlEncode}" target="_blank">{url:htmlEncode}</a></div>'
        ]
    }
});
