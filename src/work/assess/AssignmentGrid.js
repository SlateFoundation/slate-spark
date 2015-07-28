/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.assess.AssignmentGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-work-assess-assignmentgrid',

    config: {

        columns:[
            {
                dataIndex: 'Title',
                flex: 1,
                text: 'Playist'
            },
            {
                dataIndex: 'Rating',
                flex: 1,
                text: 'Rating'
            },
            {
                dataIndex: 'Comment',
                text: 'Comment',
                flex: 1
            },
            {
                dataIndex: 'VendorTitle',
                text: 'Vendor',
                flex: 1,
                renderTpl: function(v,m,r ) {
                    return '<img src="'+r.get('VendorImageUrl')+'">'+v;
                }
            }
        ],

        store: {
            fields: ['Title', 'Rating', 'Comment', 'VendorTitle', 'VendorImageUrl', 'Link'],

            data: [
                {Title: 'Playlist Title', Rating: 2, Comment: 'Comments left here', VendorTitle: 'PBS', Link: 'http://link.com'},
                {Title: 'Playlist Title', Rating: 2, Comment: 'Comments left here', VendorTitle: 'Brainpop', Link: 'http://link.com'},
                {Title: 'Playlist Title', Rating: 3, Comment: 'Comments left here', VendorTitle: 'Youtube', Link: 'http://link.com'},
                {Title: 'Playlist Title', Rating: 1, Comment: 'Comments left here', VendorTitle: 'Illuminate', Link: 'http://link.com'},
                {Title: 'Playlist Title', Rating: 1, Comment: 'Comments left here', VendorTitle: 'Youtube', Link: 'http://link.com'}
            ]
        }
    }
});