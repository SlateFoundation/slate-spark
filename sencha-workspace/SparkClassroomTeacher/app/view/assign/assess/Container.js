/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.assess.Container', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assign-assess',
    requires: [
        'Jarvus.plugin.GridFlex',
        'Ext.grid.plugin.PagingToolbar',
        'SparkClassroom.column.Standards',
        'SparkClassroom.column.Grade',
        'SparkClassroom.column.Title',
        'SparkClassroom.column.Link',
        'SparkClassroom.column.Vendor',
        'SparkClassroom.column.AssignSingle',
        'SparkClassroom.column.Flag'

    ],

    config: {
        plugins: [
            'gridflex',
            'gridpagingtoolbar'
        ],
        height: 400,
        grouped: true,
        title: 'Assess',
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
                dataIndex: 'Vendor',
                xtype: 'spark-vendor-column'
            },
            {
                dataIndex: 'Assign',
                xtype: 'spark-assign-column-single'
            },
            {
                dataIndex: 'Issue',
                xtype: 'spark-flag-column'
            }
        ],

        store: 'assign.Assess'
    }
});
