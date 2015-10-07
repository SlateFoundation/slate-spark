Ext.define('SparkClassroom.column.Flag', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-flag-column',

    config: {
        dataIndex: 'flag',
        cls: 'spark-flag-column',
        width: 64,
        text: 'Issue',
        tpl: '<a href="#" class="text-alert"><i class="fa fa-flag-o"></i></a>',
        cell: {
            encodeHtml: false
        }
    }
});
