/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.resources.Container', {
    xtype: 'spark-assign-resources',
    extend: 'Ext.grid.Grid',
    requires: [
        'Jarvus.plugin.GridFlex',
        'Ext.grid.plugin.PagingToolbar',
        'SparkClassroom.column.Standards',
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
            'gridpagingtoolbar'
        ],
        height: 500,
        grouped: true,
        titleBar: null,
        columns:[
            {
                dataIndex: 'Standards',
                xtype: 'spark-standards-column'
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
                dataIndex: 'Link',
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
