/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.resources.Container', {
    xtype: 'spark-assign-resources',
    extend: 'Ext.grid.Grid',
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
        ],

        store: 'assign.Resources'
    }
});
