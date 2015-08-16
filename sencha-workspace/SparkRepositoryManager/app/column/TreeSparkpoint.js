/* global SparkRepositoryManager */
Ext.define('SparkRepositoryManager.column.TreeSparkpoint', {
    extend: 'Ext.grid.column.Column',
    xtype: 'srm-treesparkpointcolumn',
    requires: [
        'SparkRepositoryManager.column.Sparkpoint'
    ],

    text: 'Sparkpoint',
    abbreviate: true,
    defaultRenderer: function(v) {
        return SparkRepositoryManager.column.Sparkpoint.prototype.defaultRenderer.apply(this, arguments);
    }
});