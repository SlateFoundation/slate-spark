Ext.define('SparkRepositoryManager.column.Sparkpoint', {
    extend: 'Ext.grid.column.Column',
    xtype: 'srm-sparkpointcolumn',
    requires: [
        'SparkRepositoryManager.model.Sparkpoint'
    ],

    text: 'Sparkpoint',
    renderer: function(value, metaData, record) {
        var sparkpointData = (record instanceof SparkRepositoryManager.model.Sparkpoint) ? record.getData() : record.get('other_sparkpoint');
        debugger;
        if (!sparkpointData) {
            return '[Unavailable]';
        }

        /*
         * TODO: Note: I added the "if (metaData)" because adding nodes to tree store caused a "Cannot read property 'tdAttr' of null"
         * error, but adding nodes manually may not be something we do as the app develops further.  Either way, it can't hurt.
         * If we do add nodes with appendChild, we'll have to figure this out.
         */
        if (metaData) {
            metaData.tdAttr += Ext.util.Format.attributes({
                'data-qtitle': sparkpointData.code,
                'data-qtip': Ext.XTemplate.getTpl(SparkRepositoryManager.model.Sparkpoint.prototype, 'tooltipTpl').apply(sparkpointData)
            });
        }

        return sparkpointData.abbreviation || sparkpointData.code;
    }
});