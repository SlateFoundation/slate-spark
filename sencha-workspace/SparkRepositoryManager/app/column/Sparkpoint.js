Ext.define('SparkRepositoryManager.column.Sparkpoint', {
    extend: 'Ext.grid.column.Column',
    xtype: 'srm-sparkpointcolumn',
    requires: [
        /* global SparkRepositoryManager */
        'SparkRepositoryManager.model.Sparkpoint'
    ],


    text: 'Sparkpoint',
    abbreviate: true,
    defaultRenderer: function(value, metaData, record) {
        var sparkpointData = record instanceof SparkRepositoryManager.model.Sparkpoint ? record.getData() : record.get('other_sparkpoint');

        if (!sparkpointData) {
            return '[Unavailable]';
        }

        // metaData is inaccessible during updates to existing rows
        if (metaData) {
            metaData.tdAttr += Ext.util.Format.attributes({
                'data-qtitle': sparkpointData.code,
                'data-qtip': Ext.XTemplate.getTpl(SparkRepositoryManager.model.Sparkpoint.prototype, 'tooltipTpl').apply(sparkpointData)
            });
        }

        return this.abbreviate !== false && sparkpointData.abbreviation || sparkpointData.code;
    }
});