Ext.define('SparkClassroom.column.StudentRating', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-column-studentrating',
    config: {
        enableEditing: false,

        dataIndex: 'student_rating',
        fieldName: 'rating', // This maps the records actual fieldname. TODO: find a better way to handle?

        width: 112,
        text: 'Rating',
        cell: {
            xtype: 'widgetcell',
            widget: {
                xtype: 'numberfield',
                inputCls: 'input-student-rating',
                minValue: 0,
                maxValue: 10,
                maxLength: 2,
                stepValue: 1,
                clearIcon: false,
                placeHolder: '-',
                style: { textAlign: 'center' },
                listeners: {
                    buffer: 500,
                    initialize: function() {
                        var widgetcell = this.getParent(),
                            column = widgetcell.getColumn(),
                            enableEditing = column.getEnableEditing();

                        this.setReadOnly(!enableEditing);
                    },
                    change: function(field, rating) {
                        var widgetcell = this.getParent(),
                            record = widgetcell.getRecord(),
                            column = widgetcell.getColumn(),
                            dataIndex = column.getDataIndex(),
                            fieldName = column.getFieldName();

                        if (column.getEnableEditing()) {
                            if (rating) {
                                record.set(fieldName, rating);
                            }
                        }

                    }
                }
            }
        }
    },

    updateEnableEditing: function(enableEditing) {
        this.setText(enableEditing ? 'Your Rating' : 'Rating');
    }
});