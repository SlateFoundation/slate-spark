Ext.define('SparkClassroom.column.CreatedDate', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-createddate-column',

    config: {
        dataIndex: 'created',
        cls: 'spark-createddate-column',
        width: 112,
        text: 'Created'
    }
});
