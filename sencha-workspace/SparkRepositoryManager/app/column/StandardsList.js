Ext.define('SparkRepositoryManager.column.StandardsList', {
    extend: 'Ext.grid.column.Column',
    xtype: 'srm-standardslistcolumn',
    requires: [
        'SparkRepositoryManager.widget.StandardField'
    ],


    text: 'Standards',
    dataIndex: 'StandardIDs',
    width: 275,

    filterField: {
        xtype: 'spark-standardfield'
    },

    editor: {
        xtype: 'spark-standardfield'
    },

    defaultRenderer: function(value) {
        if (Ext.isEmpty(value)) {
            return '';
        }

        var store = Ext.getStore('StandardCodes'); // eslint-disable-line vars-on-top

        return value.map(function(id) {
            var record = store.getById(id);

            return record && record.get('code') || '[' + id + ']';
        }).join(', ');
    }
});