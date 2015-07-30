Ext.define('SparkRepositoryManager.column.Sparkpoint', {
    extend: 'Ext.grid.column.Column',
    xtype: 'srm-sparkpointcolumn',

    text: 'Sparkpoint',
    dataIndex: 'code',
    renderer: function(value, metaData, record) {
        /*
         * TODO: Note: I added the "if (metaData)" because adding nodes to tree store caused a "Cannot read property 'tdAttr' of null"
         * error, but adding nodes manually may not be something we do as the app develops further.  Either way, it can't hurt.
         * If we do add nodes with appendChild, we'll have to figure this out.
         */
        if (metaData) {
            metaData.tdAttr += Ext.util.Format.attributes({
                'data-qtitle': value,
                'data-qtip': Ext.XTemplate.getTpl(record, 'tooltipTpl').apply(record.getData())
            });
        }

        return value;
    }
});
