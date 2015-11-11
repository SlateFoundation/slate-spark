Ext.define('SparkClassroom.column.StudentComment', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-column-studentcomment',


    config: {
        enableEditing: false,

        dataIndex: 'comment',
        text: 'Comments',
        flex: 1,
        cell: {
            encodeHtml: false
        },
        renderer: function(v, r) {
            v = v ? Ext.util.Format.htmlEncode(v) : '';

            if (this.getEnableEditing()) {
                return '<input class="field-control" style="width: 100%" value="'+v+'">';
            }

            return v;
        }
    }
});