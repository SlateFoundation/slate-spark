/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.points.learn.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assign-points-learn-grid',

    config: {
        columns:[
            {
                dataIndex: 'Standard',
                text: 'Standards',
                flex: 1,
                renderer: function(v, r) {
                    return '<input type="checkbox" checked="'+v+'">';
                }
            },
            {
                dataIndex: 'Grade',
                flex: 1,
                text: 'Grade'
            },
            {

                dataIndex: 'Title',
                flex: 1,
                text: 'Playist'
            },
            {
                dataIndex: 'Link',
                flex: 1,
                text: 'Url'
            },
            {
                dataIndex: 'Vendor',
                flex: 1,
                text: 'Vendor',
                renderer: function(v, r) {
                    return '<img src="http://placehold.it/25x25">'+v;
                }
            },
            {
                dataIndex: 'DOK',
                flex: 1,
                text: 'DOK'
            },
            {
                dataIndex: 'Category',
                text: 'Category',
                flex: 1
            },
            {
                dataIndex: 'SRating',
                text: 'ActiveRating',
                flex: 1,
                renderer: function(v, r) {
                    return r.get('SRating') + ' ' + r.get('TRating');
                }
            },
            {
                dataIndex: 'Attachment',
                flex: 1,
                text: 'Attachment'
            },
            {
                dataIndex: 'Assign',
                flex: 1,
                text: 'Url',
                renderer: function(v, r) {
                    var number = Math.floor((Math.random() * 4) + 1);
                    return [
                        '<input type="radio" '+(number == 1 ? 'checked' : '')+'>',
                        '<input type="radio" '+(number == 2 ? 'checked' : '')+'>',
                        '<input type="radio" '+(number == 3 ? 'checked' : '')+'>',
                        '<input type="radio" '+(number == 4 ? 'checked' : '')+'>'
                    ].join('');
                }
            },
            {
                dataIndex: 'Flag',
                flex: 1,
                text: 'Issue',
                renderer: function(v, r) {
                    return '<img src="http://placehold.it/25x25">';
                }
            }
        ],

        store: {
            fields: ['Standard', 'Grade', 'Title', 'Link', 'DOK', 'Category', 'SRating', 'TRating',  'Score', 'Attachment', 'Vendor'],


            data: [
                {Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Video', SRating: 3, TRating: 3, Score: 1, Grade: 9, Standard: '4.LA.M.B', Vendor: 'Youtube', Issue: true},
                {Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Article', SRating: 3, TRating: 3, Score: 1, Grade: 12, Standard: '5.ZA.U.B', Vendor: 'PBS', Issue: false},
                {Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Video', SRating: 3, TRating: 3, Score: 1, Grade: 11, Standard: '6.LAo.M.B', Vendor: 'Illuminate', Issue: false},
                {Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'IEPFriendly', SRating: 3, TRating: 3, Score: 1, Attachment: 'google.com', Grade: 11, Standard: '7.LEA.MO.B', Vendor: 'Reading', Issue: true},
                {Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Video', SRating: 3, TRating: 3, Score: 1, Grade: 9, Standard: '3.LA.M.B', Vendor: 'Youtube', Issue: true},
                {Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Practice Problems', SRating: 3, TRating: 3, Score: 1, Attachment: 'doc.com', Grade: 10, Standard: '6.LA.M.B', Vendor: 'PBS', Issue: false},
                {Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Video', SRating: 3, TRating: 3, Score: 1, Grade: 9, Standard: '2.LA.M.B', Vendor: 'Brainpop', Issue: false},
                {Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Reading', SRating: 3, TRating: 3, Score: 1, Grade: 10, Standard: '4.LA.M.B', Vendor: 'Youtube', Issue: false},
                {Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Video', SRating: 3, TRating: 3, Score: 1, Attachment: 'link.com', Grade: 9, Standard: '4.LA.M.B', Vendor: 'Youtube', Issue: false}
            ]
        }
    }
});