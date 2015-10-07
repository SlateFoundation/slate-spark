Ext.define('SparkClassroom.column.Vendor', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-vendor-column',

    config: {
        dataIndex: 'vendor',
        cls: 'spark-vendor-column',
        flex: 1,
        text: 'Vendor',
        cell: {
            encodeHtml: false
        },
        tpl: [
            // TODO fix/replace default vendor image and url
            '<div class="spark-grid-row-image small" style="background-image:url(',
                '<tpl if="vendor_logo">',
                    '{vendor_logo}',
                '<tpl else>',
                    '/spark-classroom-student/sencha-workspace/build/production/SparkClassroomStudent/resources/images/64x64.png',
                '</tpl>',
            ')"></div>',
            '{vendor}'
        ]
    }
});
