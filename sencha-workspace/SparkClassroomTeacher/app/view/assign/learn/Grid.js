/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.learn.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assign-learn-grid',
    requires: [
        'Jarvus.plugin.GridFlex',
        'Ext.grid.plugin.PagingToolbar',
        'SparkClassroom.widget.GridColumnFilter'
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
                width: 96,
                text: 'Grade'
            },
            {

                dataIndex: 'Title',
                width: 160,
                text: 'Playlist'
            },
            {
                dataIndex: 'Link',
                width: 160,
                text: 'URL'
            },
            {
                dataIndex: 'Vendor',
                width: 160,
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
                width: 80,
                text: 'DOK'
            },
            {
                dataIndex: 'Category',
                text: 'Category',
                width: 96
            },
            {
                dataIndex: 'SRating',
                align: 'center',
                text: 'Avg. Rating' + '<small class="flex-ct"><div class="flex-1">S</div><div class="flex-1">T</div></small>',
                width: 128,
                renderer: function(v, r) {
                    return '<div class="flex-ct text-center"><div class="flex-1">' + r.get('SRating') + '</div><div class="flex-1>' + r.get('TRating') + '</div></div>';
                },
                cell: {
                    encodeHtml: false
                }
            },
            {
                dataIndex: 'Attachment',
                width: 112,
                text: 'Attachment'
            },
            {
                dataIndex: 'Assign',

                text: 'URL',
                width: 96,
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
                    encodeHtml: false
                }
            },
            {
                dataIndex: 'Flag',
                width: 96,
                text: 'Issue',
                renderer: function(v, r) {
                    return '<img src="http://placehold.it/25x25">';
                },
                cell: {
                    encodeHtml: false
                }
            }
        ]
    },

    initialize: function() {
        var me = this;

        me.callParent();

        me.container.add({
            xtype: 'headercontainer',
            defaults: {
                xtype: 'spark-grid-column-filter'
            },
            layout: 'hbox',
            items: [
                // TODO not all columns actually have filters, and those that do need real values
                {
                    flex: 1,
                    options: [
                        { text: 'Standards' }
                    ]
                },
                {
                    width: 96,
                    options: [
                        { text: 'Grade' }
                    ]
                },
                {
                    width: 160,
                    options: [
                        { text: 'Playlist' }
                    ]
                },
                {
                    width: 160,
                    options: [
                        { text: 'URL' }
                    ]
                },
                {
                    width: 160,
                    options: [
                        { text: 'Vendor' }
                    ]
                },
                {
                    width: 80,
                    options: [
                        { text: 'DOK' }
                    ]
                },
                {
                    width: 96,
                    options: [
                        { text: 'Category' }
                    ]
                },
                {
                    width: 128,
                    options: [
                        { text: 'Avg. Rating' }
                    ]
                },
                {
                    width: 112,
                    options: [
                        { text: 'Attachment' }
                    ]
                },
                {
                    width: 96,
                    options: [
                        { text: 'Assign URL' }
                    ]
                },
                {
                    width: 96,
                    options: [
                        { text: 'Flag' }
                    ]
                }
            ]
        });
    }
});
