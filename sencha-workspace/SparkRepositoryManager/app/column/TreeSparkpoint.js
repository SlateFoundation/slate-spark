Ext.define('SparkRepositoryManager.column.TreeSparkpoint', {
    extend: 'Ext.grid.column.Column',
    xtype: 'srm-treesparkpointcolumn',
    requires: [
        /* global SparkRepositoryManager */
        'SparkRepositoryManager.column.Sparkpoint'
    ],


    text: 'Sparkpoint',
    abbreviate: true,
    defaultRenderer: function() {
        return SparkRepositoryManager.column.Sparkpoint.prototype.defaultRenderer.apply(this, arguments);
    }
});