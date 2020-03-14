Ext.define('SparkClassroom.column.Title', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-title-column',

    config: {
        dataIndex: 'title',
        cls: 'spark-title-column',
        flex: 2,
        text: 'Title'
    }
});