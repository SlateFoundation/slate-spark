Ext.define('SparkRepositoryManager.column.Standard', {
    extend: 'Ext.grid.column.Column',
    xtype: 'srm-standardcolumn',
    requires: [
        /* global SparkRepositoryManager */
        'SparkRepositoryManager.model.Standard'
    ],


    text: 'Standard',
    defaultRenderer: function(value, metaData, record) {
        var standardData = record instanceof SparkRepositoryManager.model.Standard ? record.getData() : record.get('standard');

        if (!standardData) {
            return '[Unavailable]';
        }

        // metaData is inaccessible during updates to existing rows
        if (metaData) {
            metaData.tdAttr += Ext.util.Format.attributes({
                'data-qtitle': standardData.code,
                'data-qtip': Ext.XTemplate.getTpl(SparkRepositoryManager.model.Standard.prototype, 'tooltipTpl').apply(standardData)
            });
        }

        return standardData.code;
    }
});
