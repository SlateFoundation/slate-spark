/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.assess.AssessmentsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-work-assess-assessmentsgrid',
    requires: [
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight',
        'SparkClassroom.column.Title',
        'SparkClassroom.column.Completed',
        'SparkClassroom.column.Score'
    ],

    config: {
        plugins: [
            'gridflex',
            'gridheight'
        ],
        titleBar: null,
        columns:[
            {
                dataIndex: 'Standard',
                xtype: 'spark-title-column',
                text: 'Assessment'
            },
            {
                dataIndex: 'completed',
                xtype: 'spark-completed-column'
            },
            {
                dataIndex: 'score',
                xtype: 'spark-score-column',
            }
        ],

        store: 'work.Assessments'
    }
});
