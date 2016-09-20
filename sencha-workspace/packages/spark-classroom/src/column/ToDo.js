Ext.define('SparkClassroom.column.ToDo', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-column-todo',

    config: {
        text: 'To Dos',
        dataIndex: 'todo',
        cell: {
            cls: 'spark-column-todo',
            encodeHtml: false
        },
        renderer: function(v) {
            var fm = Ext.util.Format;
            return fm.nl2br(fm.htmlEncode(v));
        }
    }
});