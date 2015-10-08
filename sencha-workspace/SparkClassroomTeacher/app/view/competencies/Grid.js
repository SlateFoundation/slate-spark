/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.competencies.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-competencies-grid',
    requires: [
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight',
        'SparkClassroom.column.Sparkpoints',
        'SparkClassroom.column.Learn',
        'SparkClassroom.column.StudentCompetency'
    ],

    config: {
        plugins: [
            'gridflex',
            'gridheight'
        ],
        titleBar: null,
        store: 'assign.Learn',
        columns:[
            {
                xtype: 'spark-sparkpoints-column'
            },
            {
                flex: 0,
                width: 500,
                xtype: 'spark-learn-column'
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
