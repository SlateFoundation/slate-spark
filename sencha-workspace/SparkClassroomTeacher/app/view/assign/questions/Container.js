/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.questions.Container', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assign-questions',
    requires: [
        'Jarvus.plugin.GridFlex',
        'Ext.grid.plugin.PagingToolbar',
        'SparkClassroom.widget.GridColumnFilter',
        'SparkClassroom.column.Standards',
        'SparkClassroom.column.Grade',
        'SparkClassroom.column.Title',
        'SparkClassroom.column.CreatedBy',
        'SparkClassroom.column.CreatedDate',
        'SparkClassroom.column.AssignSingle'
    ],

    config: {
        plugins: [
            'gridflex',
            'gridpagingtoolbar'
        ],
        height: 600,
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
                dataIndex: 'Question',
                text: 'Guiding Questions',
                xtype: 'spark-title-column'
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

        store: 'assign.Questions'
    }
});
