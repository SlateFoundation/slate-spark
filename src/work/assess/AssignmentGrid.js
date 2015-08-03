/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.assess.AssignmentGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-work-assess-assignmentgrid',

    config: {
        height: 200,
        titleBar: null,
        width: 500,
        columns:[
            {
                dataIndex: 'Title',
                width: 150,
                text: 'Playist'
            },
            {
                dataIndex: 'Rating',
                width: 50,
                text: 'Rating'
            },
            {
                dataIndex: 'Comment',
                text: 'Comment',
                width: 100
            },
            {
                dataIndex: 'VendorTitle',
                text: 'Vendor',
                width: 75,
                tpl: '<img src="http://placehold.it/15x15"> {VendorTitle}',
                cell: {
                    encodeHtml: false
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