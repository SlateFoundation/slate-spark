/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.learn.AssignmentGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-learn-assignmentgrid',

    config: {
        grouped: true,

        columns:[
            {
                dataIndex: 'Completed',
                text: 'Completed',
                flex: 1,
                renderTpl: function(v, m, r) {
                    return '<input type="checkbox" checked='+v+'>';
                }
            },
            {
                dataIndex: 'Title',
                flex: 1,
                text: 'Playist',
            },
            {
                dataIndex: 'DOK',
                flex: 1,
                text: 'DOK',
            },
            {
                dataIndex: 'Category',
                text: 'Category',
                flex: 1,
            },
            {
                dataIndex: 'SRating',
                text: 'ActiveRating',
                flex: 1,
                renderTpl: function(v, m, r) {
                    return r.get('SRating') + ' ' + r.get('TRating');
                }
            },
            {
                dataIndex: 'Score',
                flex: 1,
                text: 'Score',
            },
            {
                dataIndex: 'Attachment',
                flex: 1,
                text: 'Attachment',
            },
            {
                dataIndex: 'Flag',
                flex: 1,
                text: 'Flag',
                renderTpl: function(v, m, r) {
                    return  v ? '<img src="http://placehold.it/25x25">' : '';
                }
            }
        ],

        store: {
            fields: ['Group', 'Completed', 'Title', 'Link', 'DOK', 'Category', 'SRating', 'TRating',  'Score', 'Attachment', 'Flag'],
            grouper: {property: 'Group'},

            data: [
                {Group: 'Required', Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Video', SRating: 3, TRating: 3, Score: 1, Flag: true},
                {Completed: true, Group: 'Required', Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Article', SRating: 3, TRating: 3, Score: 1},
                {Group: 'Mr. Smith Recommends', Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Video', SRating: 3, TRating: 3, Score: 1},
                {Completed: true, Group: 'Mr. Smith Recommends', Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'IEPFriendly', SRating: 3, TRating: 3, Score: 1, Attachment: 'A link of doc'},
                {Group: 'Mr. Smith Recommends', Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Video', SRating: 3, TRating: 3, Score: 1},
                {Group: 'Additional Options', Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Practice Problems', SRating: 3, TRating: 3, Score: 1, Attachment: 'A link of doc'},
                {Group: 'Additional Options', Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Video', SRating: 3, TRating: 3, Score: 1, Flag: true},
                {Completed: true, Group: 'Additional Options', Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Reading', SRating: 3, TRating: 3, Score: 1},
                {Group: 'Additional Options', Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Video', SRating: 3, TRating: 3, Score: 1, Attachment: 'A link of doc'}
            ]
        }
    }
});