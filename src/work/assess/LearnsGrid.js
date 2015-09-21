/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.assess.LearnsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-work-assess-learnsgrid',
    requires: [
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight',
        'SparkClassroom.column.Learn'
    ],

    config: {
        plugins: [
            'gridflex',
            'gridheight'
        ],
        titleBar: null,
        columns:[
            {
                dataIndex: 'Title',
                xtype: 'spark-learn-column'
            },
            {
                dataIndex: 'Rating',
                width: 112,
                text: 'Your Rating'
            },
            {
                dataIndex: 'Comment',
                text: 'Comments',
                flex: 1
            }
        ],

        store: {
            fields: ['Title', 'Rating', 'Comment', 'VendorTitle', 'VendorImageUrl', 'Link'],

            data: [
                {Title: 'Playlist Title', Rating: 2, Comment: 'Comments left here', VendorTitle: 'PBS',         VendorImage: '', Link: 'http://link.com'},
                {Title: 'Playlist Title', Rating: 2, Comment: 'Comments left here', VendorTitle: 'Brainpop',    VendorImage: '', Link: 'http://link.com'},
                {Title: 'Playlist Title', Rating: 3, Comment: 'Comments left here', VendorTitle: 'Youtube',     VendorImage: '', Link: 'http://link.com'},
                {Title: 'Playlist Title', Rating: 1, Comment: 'Comments left here', VendorTitle: 'Illuminate',  VendorImage: '', Link: 'http://link.com'},
                {Title: 'Playlist Title', Rating: 1, Comment: 'Comments left here', VendorTitle: 'Youtube',     VendorImage: '', Link: 'http://link.com'}
            ]
        }
    }
});
