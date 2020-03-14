Ext.define('SparkClassroom.column.Grade', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-grade-column',

    config: {
        dataIndex: 'grade',
        cls: 'spark-grade-column',
        width: 80,
        text: 'Grade'
    }
});
