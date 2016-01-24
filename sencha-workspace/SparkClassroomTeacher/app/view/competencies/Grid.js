/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.competencies.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-competencies-grid',
    requires: [
        'Jarvus.plugin.GridHeight',
        'SparkClassroom.column.Sparkpoints',
        'SparkClassroom.column.Title',
        'SparkClassroom.column.StudentCompetency'
    ],

    config: {
        plugins: [
            {
                type: 'gridheight',
                enableVertical: true
            }
        ],
        titleBar: null,
        store: 'assign.Learn',
        columns:[
            {
                xtype: 'spark-sparkpoints-column'
            },
            {
                flex: null,
                width: 500,
                xtype: 'spark-title-column'
            },
            {
                xtype: 'spark-student-competency-column'
            },
            {
                xtype: 'spark-student-competency-column'
            },
            {
                xtype: 'spark-student-competency-column'
            },
            {
                xtype: 'spark-student-competency-column'
            },
            {
                xtype: 'spark-student-competency-column'
            },
            {
                xtype: 'spark-student-competency-column'
            },
            {
                xtype: 'spark-student-competency-column'
            },
            {
                xtype: 'spark-student-competency-column'
            },
            {
                xtype: 'spark-student-competency-column'
            }
        ]
    }
});