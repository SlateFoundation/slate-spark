/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.apply.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assign-apply-grid',
    requires: [
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight',
        'Ext.grid.plugin.PagingToolbar',
        'SparkClassroom.column.Standards',
        'SparkClassroom.column.Grade',
        'SparkClassroom.column.Title',
        'SparkClassroom.column.DOK',
        'SparkClassroom.column.CreatedBy',
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
        store: 'assign.Apply',
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
                dataIndex: 'DOK',
                xtype: 'spark-dok-column'
            },
            {
                dataIndex: 'CreatedBy',
                xtype: 'spark-createdby-column'
            },
            {
                dataIndex: 'Assign',
                xtype: 'spark-assign-column-single'
            }
        ]
    }
});
