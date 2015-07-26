Ext.define('SparkRepositoryManager.column.Standard', {
    extend: 'Ext.grid.column.Column',
    xtype: 'srm-standardcolumn',

    text: 'Standard',
    dataIndex: 'Code',
    renderer: function(value, metaData, record) {
        metaData.tdAttr += Ext.util.Format.attributes({
            'data-qtitle': value,
            'data-qtip': Ext.XTemplate.getTpl(record, 'tooltipTpl').apply(record.getData())
        });

        return value;
    }
});
