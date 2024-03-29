/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.assess.AssessmentsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-work-assess-assessmentsgrid',
    requires: [
        'Jarvus.plugin.GridHeight',
        'SparkClassroom.column.Link',
        'SparkClassroom.column.Completed',
        'SparkClassroom.column.Score'
    ],

    config: {
        plugins: [
            'gridheight'
        ],
        titleBar: null,
        emptyText: 'No Assessments to show for this Sparkpoint.',
        columns:[
            {
                xtype: 'spark-link-column',
                text: 'Assessment'
            },
            {
                xtype: 'spark-completed-column'
            },
            {
                xtype: 'spark-score-column',
                dataIndex: 'score'
            }
        ],

        store: 'work.Assessments'
    }
});
