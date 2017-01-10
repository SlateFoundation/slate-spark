Ext.define('SparkRepositoryManager.column.GradeLevel', {
    extend: 'Ext.grid.column.Column',
    xtype: 'srm-gradelevelcolumn',


    text: 'Grade',
    dataIndex: 'GradeLevel',
    width: 75,

    editor: {
        xtype: 'combobox',
        store: ['PK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        editable: false,
        grow: true
    },

    filterField: {
        xtype: 'combobox',
        store: ['PK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        editable: false,
        grow: true
    }

});
