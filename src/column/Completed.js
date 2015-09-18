Ext.define('SparkClassroom.column.Completed', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-completed-column',

    config: {
        cls: 'spark-completed-column',
        text: 'Completed',
        width: 96,
        cell: {
            encodeHtml: false
        },
        tpl: [
            '<div class="flex-ct">',
                '<div class="assign-control-item">',
                    '<div class="assign-control-frame single-control">',
                        '<i class="assign-control-indicator"></i>',
                    '</div>',
                '</div>',
            '</div>'
        ]
    }
});
