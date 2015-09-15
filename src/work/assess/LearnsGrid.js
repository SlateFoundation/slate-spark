/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.assess.LearnsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-work-assess-learnsgrid',
    requires: [
        'Jarvus.plugin.GridFlex'
    ],

    config: {
        plugins: [
            'gridflex'
        ],
        height: 400, // TODO remove height when possible
        titleBar: null,
        columns:[
            {
                flex: 1,
                text: 'Learns',
                cell: {
                    encodeHtml: false
                },
                tpl: [
                    '<div class="spark-grid-row-image" style="background-image:url(',
                        '<tpl if="VendorImage">',
                            '{VendorImage}',
                        '<tpl else>',
                            '/spark-classroom-student/sencha-workspace/build/production/SparkClassroomStudent/resources/images/64x64.png', // TODO some other default?
                        '</tpl>',
                    ')" title="{VendorTitle}">{VendorTitle}</div>',
                    '<div class="spark-grid-row-title">{Title}</div>',
                    '<div class="spark-grid-row-detail"><a href="{Link}">{Link}</a></div>'
                ]

            },
            {
                dataIndex: 'Rating',
                width: 130,
                text: 'Your Rating'
            },
            {
                dataIndex: 'Comment',
                text: 'Comment',
                width: 340
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
