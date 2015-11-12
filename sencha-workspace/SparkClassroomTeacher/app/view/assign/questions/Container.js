/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.questions.Container', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assign-questions',
    requires: [
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight',
        // 'Ext.grid.plugin.PagingToolbar',
        // 'SparkClassroom.widget.GridColumnFilter',
        // 'SparkClassroom.column.Sparkpoints',
        // 'SparkClassroom.column.Grade',
        'SparkClassroom.column.Title',
        'SparkClassroom.column.CreatedBy',
        'SparkClassroom.column.CreatedDate',
        'SparkClassroom.column.AssignSingle'
    ],

    config: {
        plugins: [
            'gridflex',
            'gridheight'
            // 'gridpagingtoolbar'
        ],
        titleBar: null,
        columns:[
            // {
            //     xtype: 'spark-sparkpoints-column'
            // },
            // {
            //     xtype: 'spark-grade-column'
            // },
            {
                dataIndex: 'question',
                text: 'Guiding Questions',
                xtype: 'spark-title-column'
            },
            {
                xtype: 'spark-createdby-column'
            },
            {
                xtype: 'spark-createddate-column'
            },
            {
                xtype: 'spark-assign-column-single'
            }
        ],

        store: 'assign.Questions'
    }
});
