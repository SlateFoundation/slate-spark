Ext.define('SparkClassroomTeacher.view.assign.apply.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assign-apply-grid',
    requires: [
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight',
        // 'Ext.grid.plugin.PagingToolbar',
        // 'SparkClassroom.column.Sparkpoints',
        // 'SparkClassroom.column.Grade',
        'SparkClassroom.column.Title',
        'SparkClassroom.column.DOK',
        'SparkClassroom.column.CreatedBy',
        'SparkClassroom.column.Assignments'
    ],

    config: {
        plugins: [
            'gridflex',
            'gridheight'
            // 'gridpagingtoolbar'
        ],
        grouped: true,
        titleBar: null,
        store: 'assign.Applies',
        columns:[
            // {
            //     xtype: 'spark-sparkpoints-column'
            // },
            // {
            //     xtype: 'spark-grade-column'
            // },
            {
                xtype: 'spark-title-column'
            },
            {
                xtype: 'spark-dok-column'
            },
            {
                xtype: 'spark-createdby-column'
            },
            {
                xtype: 'spark-column-assignments'
            }
        ]
    },

    onItemTap: function(ev, t) {
        var me = this;

        me.fireEvent('applytap', me, Ext.get(t).component);

        me.callParent(arguments);
    }
});
