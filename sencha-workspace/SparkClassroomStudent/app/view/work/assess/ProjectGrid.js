/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.work.assess.ProjectGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-student-work-assess-projectgrid',
    requires: [
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight'
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
                flex: 1,
                text: 'Apply'
            },
            {
                dataIndex: 'Rating',
                width: 130,
                text: 'Rating',
                renderTpl: function(v,m,r ) {
                    return '<img src="'+r.get('VendorImageUrl')+'">'+v;
                }
            },
            {
                dataIndex: 'Comment',
                text: 'Comment',
                width: 340,
                renderTpl: function(v,m,r ) {
                    return '<select><option>'+v+'</option></select>';
                }
            }
        ],

        store: {
            fields: ['Title', 'Rating', 'Comment', 'VendorTitle', 'VendorImageUrl', 'Link'],

            data: [
                {Title: 'Project Name of Apply', Rating: 2, Comment: 'Comments left here'}
            ]
        }
    }
});
