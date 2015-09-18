/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.learn.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-work-learn-grid',
    requires: [
        'Jarvus.plugin.GridFlex',
        'SparkClassroom.column.Completed',
        'SparkClassroom.column.Learn',
        'SparkClassroom.column.DOK',
        'SparkClassroom.column.LearnType',
        'SparkClassroom.column.Rating',
        'SparkClassroom.column.Score',
        'SparkClassroom.column.Attachment',
    ],

    config: {
        plugins: [
            'gridflex'
        ],
        height: 500,
        grouped: true,
        titleBar: null,
        columns:[
            {
                dataIndex: 'Completed',
                xtype: 'spark-completed-column'
            },
            {
                dataIndex: 'Title',
                xtype: 'spark-learn-column',
                flex: 2
            },
            {
                dataIndex: 'DOK',
                xtype: 'spark-dok-column'
            },
            {
                dataIndex: 'Category',
                xtype: 'spark-learntype-column'
            },
            {
                dataIndex: 'SRating',
                xtype: 'spark-rating-column'
            },
            {
                dataIndex: 'Score',
                xtype: 'spark-score-column'
            },
            {
                dataIndex: 'Attachment',
                xtype: 'spark-attachment-column'
            }
        ],

        store: {
            fields: ['Group', 'Completed', 'Title', 'Link', 'DOK', 'Category', 'SRating', 'TRating',  'Score', 'Attachment', 'Issue'],

            grouper: {
                property: 'Group',
                direction: 'DESC'
            },
            sorters: [
                {
                    sorterFn: function(standard1) {
                        switch (standard1) {
                            case 'Required':
                                return -1;
                            case 'AdditionOptions':
                                return 1;
                        }
                    }
                }
            ],
            data: [
                {Group: 'Required', Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Video', SRating: 3, TRating: 3, Score: '85%', Issue: true},
                {Completed: true, Group: 'Required', Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Article', SRating: 3, TRating: 3, Score: null, Issue: true},
                {Group: 'Mr. Smith Recommends', Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Video', SRating: 3, TRating: 3, Score: '85%', Issue: true},
                {Completed: true, Group: 'Mr. Smith Recommends', Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'IEPFriendly', SRating: 3, TRating: 3, Score: null, Attachment: 'A link of doc', Issue: true},
                {Group: 'Mr. Smith Recommends', Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Video', SRating: 3, TRating: 3, Score: null},
                {Group: 'Additional Options', Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Practice Problems', SRating: 3, TRating: 3, Score: null, Attachment: 'A link of doc'},
                {Group: 'Additional Options', Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Video', SRating: 3, TRating: 3, Score: null, Issue: true},
                {Completed: true, Group: 'Additional Options', Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Reading', SRating: 3, TRating: 3, Score: null},
                {Group: 'Additional Options', Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Video', SRating: 3, TRating: 3, Score: null, Attachment: 'A link of doc'}
            ]
        }
    }
});
