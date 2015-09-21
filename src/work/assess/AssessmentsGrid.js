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
                text: 'Assessment Selected'
            },
            {
                dataIndex: 'Completed',
                xtype: 'spark-completed-column'
            },
            {
                dataIndex: 'Score',
                xtype: 'spark-score-column'
            }
        ],

        store: {
            fields: [ 'Standard', 'Completed', 'Score' ],

            data: [
                {
                    Standard: 'Playlist Title',
                    Score: false,
                    Completed: false
                },
                {
                    Standard: 'Playlist Title',
                    Score: 2,
                    Completed: true
                }
            ]
        }
    }
});
