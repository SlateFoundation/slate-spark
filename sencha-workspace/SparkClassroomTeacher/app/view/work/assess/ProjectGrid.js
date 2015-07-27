/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.work.assess.ProjectGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-work-assess-projectgrid',

    config: {

        columns:[
            {
                dataIndex: 'Title',
                flex: 1,
                text: 'Apply'
            },
            {
                dataIndex: 'Rating',
                flex: 1,
                text: 'Rating',
                renderTpl: function(v,m,r ) {
                    return '<img src="'+r.get('VendorImageUrl')+'">'+v;
                }
            },
            {
                dataIndex: 'Comment',
                text: 'Comment',
                flex: 1,
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