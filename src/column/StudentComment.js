Ext.define('SparkClassroom.column.StudentComment', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-column-studentcomment',


    config: {
        enableEditing: false,

        dataIndex: 'comment',
        text: 'Comments',
        flex: 1,
        cell: {

            xtype: 'widgetcell',
            widget: {
                xtype: 'textareafield',
                inputCls: 'input-student-comment',
                clearIcon: false,
                placeHolder: 'Add your comments here. (Optional)',
                style: { textAlign: 'center' },
                listeners: {
                    buffer: 500,
                    initialize: function() {
                        var widgetcell = this.getParent(),
                            enableEditing = widgetcell.getColumn().getEnableEditing();

                        this.setReadOnly(!enableEditing);
                    },
                    change: function(field, cmnt) {
                        var widgetcell = this.getParent(),
                            record = widgetcell.getRecord(),
                            column = widgetcell.getColumn(),
                            dataIndex = column.getDataIndex();

                        if (column.getEnableEditing()) {
                            record.set(dataIndex, cmnt);
                        }
                    }
                }
            }
        }
    }
});