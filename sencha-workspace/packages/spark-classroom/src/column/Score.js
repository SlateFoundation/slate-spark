Ext.define('SparkClassroom.column.Score', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-score-column',

    config: {
        dataIndex: 'score',
        cls: 'spark-score-column',
        width: 80,
        text: 'Score'
    }
});
