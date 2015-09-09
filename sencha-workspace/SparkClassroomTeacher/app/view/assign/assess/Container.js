/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.assess.Container', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assign-assess',
    requires: [
        'SparkClassroom.plugin.GridFlex',
        'Ext.grid.plugin.PagingToolbar'
    ],

    config: {
        plugins: [
            'gridflex',
            'gridpagingtoolbar'
        ],
        height: 400,
        grouped: true,
        title: 'Assess',
        titleBar: null,
        margin: '0 -24', // flush with viewport
        columns:[
            {
                dataIndex: 'Standards',
                width: 288,
                text: 'Standards',
                tpl: '{[values.Standards.join(", ")]}'
            },
            {
                dataIndex: 'Grade',
                width: 96,
                text: 'Grade'
            },
            {
                dataIndex: 'Link',
                flex: 1,
                text: 'URL'
            },
            {
                dataIndex: 'Title',
                flex: 2,
                text: 'Title'
            },
            {
                dataIndex: 'Vendor',
                flex: 1,
                text: 'Vendor',
                cell: {
                    encodeHtml: false
                },
                tpl: [
                    // TODO fix/replace default vendor image and url
                    '<div class="spark-grid-row-image small" style="background-image:url(',
                        '<tpl if="VendorImage">',
                            '{VendorImage}',
                        '<tpl else>',
                            '/spark-classroom-student/sencha-workspace/build/production/SparkClassroomStudent/resources/images/64x64.png',
                        '</tpl>',
                    ')"></div>',
                    '{Vendor}'
                ]
            },
            {
                dataIndex: 'Assign',
                text: 'Assign',
                width: 80,
                sortable: false,
                tpl: '<input type="checkbox" checked="{Assign}">',
                cell: {
                    encodeHtml: false
                }
            },
            {
                dataIndex: 'Issue',
                text: 'Issue',
                width: 64,
                sortable: false,
                tpl: '<a href="#"><i class="fa fa-flag-o text-alert"></i></a>',
                cell: {
                    encodeHtml: false
                }
            }
        ],

        store: 'assign.Assess'
    }
});
