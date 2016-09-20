Ext.define('SparkClassroom.column.Attachment', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-attachment-column',

    config: {
        dataIndex: 'attachment',
        cls: 'spark-attachment-column',
        flex: 1,
        text: 'Attachment'
    }
});
