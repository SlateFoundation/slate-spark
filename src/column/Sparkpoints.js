Ext.define('SparkClassroom.column.Sparkpoints', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-sparkpoints-column',

    config: {
        dataIndex: 'sparkpoint',
        cls: 'spark-sparkpoints-column',
        width: 208,
        text: 'Sparkpoints',
        cell: {
            cls: 'spark-sparkpoints-cell',
            encodeHtml: false,
        },
        renderer: function (value, record) {
            return [
                '<div class="flex-ct">',
                    '<span class="spark-column-value flex-1">', value, '</span>',
                    '<button class="button tiny" action="add-to-queue">+&nbsp;Q</button>',
                '</div>'
            ].join('');
        }
    }
});
