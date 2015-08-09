/* global SparkRepositoryManager */
Ext.define('SparkRepositoryManager.column.TreeSparkpoint', {
    extend: 'Ext.grid.column.Column',
    xtype: 'srm-treesparkpointcolumn',
    requires: [
        'SparkRepositoryManager.column.Sparkpoint'
    ],

    text: 'Sparkpoint',
    dataIndex: 'other_sparkpoint_code',
    renderer: function(v) {
        return SparkRepositoryManager.column.Sparkpoint.prototype.renderer.apply(this, arguments);
    }
});