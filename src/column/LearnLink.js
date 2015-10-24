Ext.define('SparkClassroom.column.LearnLink', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-learnlink-column',

    config: {
        cls: 'spark-learnlink-column',
        flex: 1,
        dataIndex: 'title',
        text: 'Link',
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

            '<div class="spark-grid-row-title">',
                '<a href="{launchUrl:htmlEncode}" title="{title:htmlEncode}" target="_blank">',
                    '{title:htmlEncode}',
                '</a>',
            '</div>'
        ]
    }
});
