Ext.define('SparkClassroom.column.Learn', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-learn-column',

    config: {
        cls: 'spark-learn-column',
        flex: 1,
        dataIndex: 'title',
        text: 'Learn',
        cell: {
            encodeHtml: false
        },
        tpl: [
            '<div class="spark-grid-row-image" style="background-image:url(',
                '<tpl if="thumbnail">',
                    '{thumbnail:htmlEncode}',
                '<tpl else>',
                    '/spark-classroom-student/sencha-workspace/build/production/SparkClassroomStudent/resources/images/64x64.png', // TODO some other default?
                '</tpl>',
            ')" title="{vendor:htmlEncode}">{vendor:htmlEncode}</div>',
            '<div class="spark-grid-row-title">{title:htmlEncode}</div>',
            '<div class="spark-grid-row-detail"><a href="{url:htmlEncode}" title="{title:htmlEncode}" target="_blank">{url:htmlEncode}</a></div>'
        ]
    }
});
