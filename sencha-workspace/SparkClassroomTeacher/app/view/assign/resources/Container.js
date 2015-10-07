/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.resources.Container', {
    xtype: 'spark-assign-resources',
    extend: 'Ext.grid.Grid',
    requires: [
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight',
        'Ext.grid.plugin.PagingToolbar',
        'SparkClassroom.column.Sparkpoints',
        'SparkClassroom.column.Grade',
        'SparkClassroom.column.Title',
        'SparkClassroom.column.Link',
        'SparkClassroom.column.CreatedBy',
        'SparkClassroom.column.CreatedDate',
        'SparkClassroom.column.AssignSingle'
    ],

    config: {
        plugins: [
            'gridflex',
            'gridheight',
            'gridpagingtoolbar'
        ],
        grouped: true,
        titleBar: null,
        columns:[
            {
                xtype: 'spark-sparkpoints-column'
            },
            {
                dataIndex: 'Grade',
                xtype: 'spark-grade-column'
            },
            {
                dataIndex: 'Title',
                xtype: 'spark-title-column'
            },
            {
                xtype: 'spark-link-column'
            },
            {
                dataIndex: 'CreatedBy',
                xtype: 'spark-createdby-column'
            },
            {
                dataIndex: 'Created',
                xtype: 'spark-createddate-column'
            },
            {
                dataIndex: 'Assign',
                xtype: 'spark-assign-column-single'
            }
        ],

        store: 'assign.Resources'
    }
});
