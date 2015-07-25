/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.assess.AssignmentGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assess-assignmentgrid',

    config: {
        columns:[
            {
                dataIndex: 'Title',
                flex: 1,
                text: 'Assessment'
            },
            {
                dataIndex: 'Completed',
                text: 'Completed',
                flex: 1,
                renderTpl: function(v, m, r) {
                    return '<input type="checkbox" checked='+v+'>';
                }
            },
            {
                dataIndex: 'Score',
                flex: 1,
                text: 'Score',
                renderTpl: function (v, m, r) {
                    return v + '/20';
                }
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