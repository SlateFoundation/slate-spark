Ext.define('SparkClassroom.column.Completed', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-completed-column',
    uses: [
        // TODO: FIXME: HACK: we need to require this unrelated component because it's SCSS defines .assign-control-frame, the CSS for "checkboxes" needs to be refactored and put under etc/ or assigned to a common ancestor component
        'SparkClassroom.column.Assignments'
    ],

    config: {
        allowToggle: true,
        requireLaunched: false,

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
                        column = me.getColumn(),
                        dataIndex = column.getDataIndex();

                    if (column.getAllowToggle() && (!column.getRequireLaunched() || record.get('launched'))) {
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