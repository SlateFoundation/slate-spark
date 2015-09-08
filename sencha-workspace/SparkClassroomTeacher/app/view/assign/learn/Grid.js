/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.learn.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assign-learn-grid',
    requires: [
        'SparkClassroom.plugin.GridFlex',
        'Ext.grid.plugin.PagingToolbar'
    ],

    config: {
        plugins: [
            'gridflex',
            'gridpagingtoolbar'
        ],
        height: 500,
        grouped: true,
        titleBar: null,
        store: 'assign.Learn',
        columns:[
            {
                dataIndex: 'Standards',
                text: 'Standards',
                flex: 1,
                tpl: '{[values.Standards ? values.Standards.join(", ") : ""]}',
                cell: {
                    encodeHtml: false
                }
            },
            {
                dataIndex: 'Grade',
                width: 100,
                text: 'Grade'
            },
            {

                dataIndex: 'Title',
                width: 200,
                text: 'Playist'
            },
            {
                dataIndex: 'Link',
                width: 200,
                text: 'Url'
            },
            {
                dataIndex: 'Vendor',
                width: 200,
                text: 'Vendor',
                renderer: function(v, r) {
                    return '<img src="http://placehold.it/25x25">'+v;
                },
                cell: {
                    encodeHtml: false
                }
            },
            {
                dataIndex: 'DOK',
                width: 100,
                text: 'DOK'
            },
            {
                dataIndex: 'Category',
                text: 'Category',
                width: 100
            },
            {
                dataIndex: 'SRating',
                text: 'ActiveRating',
                width: 100,
                renderer: function(v, r) {
                    return r.get('SRating') + ' ' + r.get('TRating');
                },
                cell: {
                    encodeHtml: false
                }
            },
            {
                dataIndex: 'Attachment',
                width: 100,
                text: 'Attachment'
            },
            {
                dataIndex: 'Assign',
            
                text: 'Url',
                width: 100,
                renderer: function(v, r) {
                    var number = Math.floor((Math.random() * 4) + 1);
                    return [
                        '<input type="radio" '+(number == 1 ? 'checked' : '')+'>',
                        '<input type="radio" '+(number == 2 ? 'checked' : '')+'>',
                        '<input type="radio" '+(number == 3 ? 'checked' : '')+'>',
                        '<input type="radio" '+(number == 4 ? 'checked' : '')+'>'
                    ].join('');
                },
                cell: {
                    flex: 1,
                    encodeHtml: false
                }
            },
            {
                dataIndex: 'Flag',
                width: 100,
                text: 'Issue',
                renderer: function(v, r) {
                    return '<img src="http://placehold.it/25x25">';
                },
                cell: {
                    encodeHtml: false
                }
            }
        ]
    }
});