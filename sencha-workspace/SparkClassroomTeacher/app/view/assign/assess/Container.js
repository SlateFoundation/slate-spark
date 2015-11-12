/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.assess.Container', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assign-assess',
    requires: [
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight',
        // 'Ext.grid.plugin.PagingToolbar',
        // 'SparkClassroom.column.Sparkpoints',
        // 'SparkClassroom.column.Grade',
        'SparkClassroom.column.Title',
        'SparkClassroom.column.URL',
        'SparkClassroom.column.Vendor',
        'SparkClassroom.column.AssignSingle',
        'SparkClassroom.column.Flag'

    ],

    config: {
        plugins: [
            'gridflex',
            'gridheight'
            // 'gridpagingtoolbar'
        ],
        grouped: true,
        title: 'Assess',
        titleBar: null,
        columns:[
            // {
            //     xtype: 'spark-sparkpoints-column'
            // },
            // {
            //     xtype: 'spark-grade-column'
            // },
            {
                xtype: 'spark-title-column'
            },
            {
                xtype: 'spark-url-column'
            },
            {
                xtype: 'spark-vendor-column'
            },
            {
                xtype: 'spark-assign-column-single'
            },
            {
                xtype: 'spark-flag-column'
            }
        ],

        store: 'assign.Assess'
    }
});
