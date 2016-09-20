Ext.define('SparkClassroom.column.Flag', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-flag-column',

    config: {
        dataIndex: 'flag',
        cls: 'spark-flag-column',
        width: 64,
        text: 'Issue',
        tpl: '<div class="text-center"><a href="#" class="text-alert"><i class="fa fa-flag-o"></i></a></div>',
        cell: {
            encodeHtml: false
        }
    }
});
