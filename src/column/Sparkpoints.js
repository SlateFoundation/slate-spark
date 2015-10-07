Ext.define('SparkClassroom.column.Sparkpoints', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-sparkpoints-column',

    config: {
        dataIndex: 'sparkpoints',
        cls: 'spark-sparkpoints-column',
        width: 208,
        text: 'Sparkpoints',
        tpl: '<tpl if="sparkpoints">{[values.sparkpoints.join(", ")]}</tpl>'
    }
});
