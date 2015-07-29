Ext.define('SparkRepositoryManager.column.Sparkpoint', {
    extend: 'Ext.grid.column.Column',
    xtype: 'srm-sparkpointcolumn',

    text: 'Sparkpoint',
    dataIndex: 'code',
    renderer: function(value, metaData, record) {
        metaData.tdAttr += Ext.util.Format.attributes({
            'data-qtitle': value,
            'data-qtip': Ext.XTemplate.getTpl(record, 'tooltipTpl').apply(record.getData())
        });

        return value;
    }
});