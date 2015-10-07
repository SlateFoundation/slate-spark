Ext.define('SparkClassroom.column.CreatedBy', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-createdby-column',

    config: {
        dataIndex: 'created_by',
        cls: 'spark-createdby-column',
        width: 192,
        text: 'Created By'
    }
});
