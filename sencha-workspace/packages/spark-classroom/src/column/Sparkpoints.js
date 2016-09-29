Ext.define('SparkClassroom.column.Sparkpoints', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-sparkpoints-column',
    requires: [
        'SparkClassroom.column.panel.AddToQueue'
    ],

    config: {
        dataIndex: 'sparkpoint',
        cls: 'spark-sparkpoints-column',
        width: 208,
        text: [
            '<select class="field-control"><option>Student</option></select>',
            '<select class="field-control"><option>Sparkpoint</option></select>'
        ].join(''),
        cell: {
            cls: 'spark-sparkpoints-cell',
            encodeHtml: false,

            listeners: {
                click: {
                    element: 'element',
                    delegate: 'button[action="add-to-queue"]',
                    fn: function(ev, t) {
                        var btn = Ext.get(t);

                        Ext.select('.is-stuck').each(function() {
                            this.removeCls('is-stuck');
                        });
                        btn.addCls('is-stuck');
                    }
                }
            }
        },
        renderer: function (value) {
            return [
                '<div class="flex-ct">',
                    '<span class="spark-column-value flex-1">', value, '</span>',
                    '<button class="button tiny" action="add-to-queue">+&nbsp;Q</button>',
                '</div>'
            ].join('');
        }
    }
});
