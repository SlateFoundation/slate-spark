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
        height: 600,
        titleBar: null,
        store: 'assign.Learn',
        columns:[
            {
                width: 240,
                dataIndex: 'Standards',
                text: 'Standards',
                tpl: '{[values.Standards ? values.Standards.join(", ") : ""]}',
                cell: {
                    encodeHtml: false
                }
            },
            {
                width: 96,
                dataIndex: 'Grade',
                text: 'Grade'
            },
            {
                flex: 1,
                dataIndex: 'Title',
                text: 'Learn',
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
                    ')" title="{Vendor}">{Vendor}</div>',
                    '<div class="spark-grid-row-title">{Title}</div>',
                    '<div class="spark-grid-row-detail"><a href="{Link}">{Link}</a></div>'
                ]
            },
            {
                width: 64,
                dataIndex: 'DOK',
                text: 'DOK'
            },
            {
                width: 64,
                dataIndex: 'Category',
                text: 'Type',
                cell: {
                    encodeHtml: false
                },
                renderer: function(v, r) {
                    var type = r.get('Category');

                    // TODO get list of possible strings and assign icons
                    var icons = {
                        'Video':                'youtube-play',
                        'Article':              'newspaper-o',
                        'Practice Problems':    'calculator',
                        'IEPFriendly':          'folder-open-o',
                        'Reading':              'bookmark-o'
                    };

                    var icon = icons[type];

                    if (icon) {
                        return '<div class="text-center" title="' + type + '"><i class="fa fa-lg fa-' + icon + '"></i></div>';
                    } else {
                        return type;
                    }
                }
            },
            {
                width: 112,
                dataIndex: 'SRating',
                align: 'center',
                text: 'Avg. Rating' + '<small class="flex-ct"><div class="flex-1">S</div><div class="flex-1">T</div></small>',
                renderer: function(v, r) {
                    return '<div class="flex-ct text-center"><div class="flex-1">' + r.get('SRating') + '</div><div class="flex-1">' + r.get('TRating') + '</div></div>';
                },
                cell: {
                    encodeHtml: false
                }
            },
            {
                width: 144,
                dataIndex: 'Attachment',
                text: 'Attachment'
            },
            {
                width: 240,
                dataIndex: 'Assign',
                text: 'Assign',
                renderer: function(v, r) {
                    var i = 1,
                        controlItems = {};

                    var filledItem = Math.floor(Math.random() * 4) + 1;

                    // TODO replace all this randomized junk with real data
                    for (; i<5; i++) {
                        if (i == filledItem) {
                            var isFull = Math.random()<.5;
                            controlItems[i] = isFull ? 'is-full' : 'is-partial';
                        } else {
                            controlItems[i] = 'is-empty';
                        }
                    }

                    return [
                        '<ul class="assign-control-list">',
                            '<li class="assign-control-item ' + controlItems[1] + '">',
                                '<div class="assign-control-frame">',
                                    '<div class="assign-control-indicator"></div>',
                                '</div>',
                            '</li>',
                            '<li class="assign-control-item ' + controlItems[2] + '">',
                                '<div class="assign-control-frame">',
                                    '<div class="assign-control-indicator"></div>',
                                '</div>',
                            '</li>',
                            '<li class="assign-control-item ' + controlItems[3] + '">',
                                '<div class="assign-control-frame">',
                                    '<div class="assign-control-indicator"></div>',
                                '</div>',
                            '</li>',
                            '<li class="assign-control-item ' + controlItems[4] + '">',
                                '<div class="assign-control-frame">',
                                    '<div class="assign-control-indicator"></div>',
                                '</div>',
                            '</li>',
                        '</ul>',
                    ].join('');
                },
                cell: {
                    encodeHtml: false
                }
            },
            {
                width: 64,
                dataIndex: 'Flag',
                text: 'Issue',
                tpl: '<div class="text-center"><a href="#" class="text-alert"><i class="fa fa-flag"></i></a></div>',
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
                // TODO measure column widths/flex values automatically pls
                {
                    width: 240,
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
                    flex: 1,
                    options: [
                        { text: 'Learn' }
                    ]
                },
                {
                    width: 64,
                    options: [
                        { text: 'DOK' }
                    ]
                },
                {
                    width: 64,
                    options: [
                        { text: 'Type' }
                    ]
                },
                {
                    width: 112,
                    options: [
                        { text: 'Ratings' }
                    ]
                },
                {
                    width: 144,
                    options: [
                        { text: 'Attachment' }
                    ]
                },
                {
                    width: 240,
                    options: [
                        { text: 'Assign' }
                    ]
                },
                {
                    width: 64,
                    options: [
                        { text: 'Flag' }
                    ]
                }
            ]
        });
    }
});
