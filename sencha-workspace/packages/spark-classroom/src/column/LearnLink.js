Ext.define('SparkClassroom.column.LearnLink', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-learnlink-column',

    config: {
        cls: 'spark-learnlink-column',
        flex: 1,
        dataIndex: 'title',
        text: 'Link',
        cell: {
            cls: 'spark-learnlink-cell',
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
            '<div class="spark-grid-row-title">',
                '<a href="{launch_url:htmlEncode}" title="{title:htmlEncode}" target="_blank">',
                    '{title:htmlEncode}',
                '</a>',
            '</div>'
        ]
    }
});
