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
                '<tpl if="VendorImage">',
                    '{VendorImage}',
                '<tpl else>',
                    '/spark-classroom-student/sencha-workspace/build/production/SparkClassroomStudent/resources/images/64x64.png', // TODO some other default?
                '</tpl>',
            ')" title="{Vendor}">{Vendor}</div>',
            '<div class="spark-grid-row-title">{Title}</div>',
            '<div class="spark-grid-row-detail"><a href="{Link}" title="{Link}">{Link}</a></div>'
        ]
    }
});
