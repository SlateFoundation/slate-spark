Ext.define('SparkClassroom.column.Sparkpoints', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-sparkpoints-column',

    config: {
        dataIndex: 'sparkpoint',
        cls: 'spark-sparkpoints-column',
        width: 208,
        text: 'Sparkpoints'
    }
});
