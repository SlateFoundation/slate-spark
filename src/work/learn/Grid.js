/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.learn.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-work-learn-grid',
    requires: [
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight',
        'SparkClassroom.column.Completed',
        'SparkClassroom.column.Link',
        'SparkClassroom.column.DOK',
        'SparkClassroom.column.LearnType',
        'SparkClassroom.column.Rating',
        'SparkClassroom.column.Score',
        'SparkClassroom.column.Attachment'
    ],

    config: {
        plugins: [
            'gridflex',
            'gridheight'
        ],
        emptyText: 'No Learns to show for this Sparkpoint.',
        //grouped: true,
        titleBar: null,
        columns:[
            {
                xtype: 'spark-completed-column'
            },
            {
                xtype: 'spark-link-column',
                text: 'Learn',
                flex: 2
            },
            {
                dataIndex: 'dok',
                xtype: 'spark-dok-column'
            },
            {
                dataIndex: 'category',
                xtype: 'spark-learntype-column'
            },
            {
                dataIndex: 'rating',
                xtype: 'spark-rating-column'
            },
            {
                dataIndex: 'score',
                xtype: 'spark-score-column'
            },
            {
                dataIndex: 'attachments',
                xtype: 'spark-attachment-column'
            }
        ],

        store: 'work.Learns'
    }
});
