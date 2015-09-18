Ext.define('SparkClassroom.column.Standards', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-standards-column',

    config: {
        cls: 'spark-standards-column',
        width: 208,
        text: 'Standards',
        tpl: '{[values.Standards ? values.Standards.join(", ") : ""]}'
    }
});
