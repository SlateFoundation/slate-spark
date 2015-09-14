/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.learn.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-work-learn-grid',
    requires: [
        'Jarvus.plugin.GridFlex'
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
                text: 'Done',
                width: 85,
                tpl: '<input type="checkbox" checked="{Completed}">',
                cell: {
                    encodeHtml: false
                }
            },
            {
                dataIndex: 'Title',
                flex: 2,
                text: 'Playist'
            },
            {
                dataIndex: 'DOK',
                width: 85,
                text: 'DOK'
            },
            {
                dataIndex: 'Category',
                text: 'Category',
                flex: 1
            },
            {
                dataIndex: 'SRating',
                text: 'Avg. Rating',
                width: 130,
                tpl: '{SRating}    {TRating}',
                cell: {
                    encodeHtml: false
                }
            },
            {
                dataIndex: 'Score',
                width: 85,
                align: 'center',
                text: 'Score'
            },
            {
                dataIndex: 'Attachment',
                flex: 1,
                text: 'Attachment'
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
