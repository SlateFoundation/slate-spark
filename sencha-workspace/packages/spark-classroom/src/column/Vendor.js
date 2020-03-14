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
            '<div',
                ' class="spark-grid-row-image small"',
                '<tpl if="vendor_logo">',
                    ' style="background-image:url({vendor_logo})"',
                '</tpl>',
            '>',
            '</div>',
            '{vendor}'
        ]
    }
});
