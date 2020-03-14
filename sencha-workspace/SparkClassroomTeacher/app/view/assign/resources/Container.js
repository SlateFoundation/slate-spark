Ext.define('SparkClassroomTeacher.view.assign.resources.Container', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assign-resources',
    requires: [
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight',
        // 'Ext.grid.plugin.PagingToolbar',
        // 'SparkClassroom.column.Sparkpoints',
        // 'SparkClassroom.column.Grade',
        'SparkClassroom.column.Title',
        'SparkClassroom.column.URL',
        'SparkClassroom.column.CreatedBy',
        'SparkClassroom.column.CreatedDate',
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
        store: 'assign.ConferenceResources',
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
                xtype: 'spark-url-column'
            },
            {
                xtype: 'spark-createdby-column'
            },
            {
                xtype: 'spark-createddate-column'
            },
            {
                xtype: 'spark-column-assignments'
            }
        ]
    }
});
