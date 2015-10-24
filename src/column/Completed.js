Ext.define('SparkClassroom.column.Completed', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-completed-column',

    config: {
        allowToggle: true,

        cls: 'spark-completed-column',
        dataIndex: 'completed',
        text: 'Completed',
        width: 96,
        cell: {
            encodeHtml: false,
            listeners: {
                element: 'element',
                delegate: '.assign-control-frame',
                tap: function(ev, t) {
                    var me = this,
                        record = me.getRecord(),
                        dataIndex = me.getColumn().getDataIndex();

                    if (me.getColumn().getAllowToggle()) {
                        record.set(dataIndex, !record.get(dataIndex));
                    }
                }
            }
        },
        tpl: [
            '<div class="flex-ct">',
                '<div class="assign-control-item <tpl if="completed">is-full<tpl elseif="launched">is-partial</tpl>">', // TODO: "assign" is an innacurate term here @ryon
                    '<div class="assign-control-frame single-control">',
                        '<i class="assign-control-indicator"></i>',
                    '</div>',
                '</div>',
            '</div>'
        ]
    }
});