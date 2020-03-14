/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.EditableGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-editablegrid',


    config: {
        enableEditing: false
    },

    updateEnableEditing: function(enableEditing) {
        var columns = this.getColumns(),
            columnsLen = columns.length,
            i = 0, column;

        for (; i < columnsLen; i++) {
            column = columns[i];
            if (column.setEnableEditing) {
                column.setEnableEditing(enableEditing);
            }
        }
    }
});