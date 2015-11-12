/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.learn.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assign-learn-grid',
    requires: [
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight',
        // 'Ext.grid.plugin.PagingToolbar',
        // 'SparkClassroom.widget.GridColumnFilter',
        // 'SparkClassroom.column.Sparkpoints',
        // 'SparkClassroom.column.Grade',
        'SparkClassroom.column.Link',
        'SparkClassroom.column.LearnType',
        'SparkClassroom.column.DOK',
        'SparkClassroom.column.Rating',
        // 'SparkClassroom.column.Attachment',
        'SparkClassroom.column.AssignMulti',
        'SparkClassroom.column.Flag'
    ],

    config: {
        plugins: [
            'gridflex',
            'gridheight'
            // 'gridpagingtoolbar'
        ],
        titleBar: null,
        store: 'assign.Learn',
        columns:[
            // {
            //     xtype: 'spark-sparkpoints-column'
            // },
            // {
            //     xtype: 'spark-grade-column'
            // },
            {
                flex: 2,
                xtype: 'spark-link-column',
                text: 'Learn',
                cell: {
                    encodeHtml: false,
                    cls: 'spark-cell-nowrap'
                }
            },
            {
                xtype: 'spark-learntype-column'
            },
            {
                xtype: 'spark-dok-column'
            },
            {
                xtype: 'spark-rating-column'
            },
            // {
            //     xtype: 'spark-attachment-column'
            // },
            {
                xtype: 'spark-assign-column-multi'
            },
            {
                xtype: 'spark-flag-column'
            }
        ]
    }

    // initialize: function() {
    //     var me = this;

    //     me.callParent();

    //     me.container.add({
    //         xtype: 'headercontainer',
    //         defaults: {
    //             xtype: 'spark-grid-column-filter'
    //         },
    //         layout: 'hbox',
    //         items: [
    //             // TODO not all columns actually have filters, and those that do need real values
    //             // TODO measure column widths/flex values automatically pls
    //             {
    //                 width: 208,
    //                 options: [
    //                     { text: 'Sparkpoints' }
    //                 ]
    //             },
    //             {
    //                 width: 80,
    //                 options: [
    //                     { text: 'Grade' }
    //                 ]
    //             },
    //             {
    //                 flex: 1,
    //                 options: [
    //                     { text: 'Learn' }
    //                 ]
    //             },
    //             {
    //                 width: 64,
    //                 options: [
    //                     { text: 'Type' }
    //                 ]
    //             },
    //             {
    //                 width: 64,
    //                 options: [
    //                     { text: 'DOK' }
    //                 ]
    //             },
    //             {
    //                 width: 112,
    //                 options: [
    //                     { text: 'Ratings' }
    //                 ]
    //             },
    //             {
    //                 width: 144,
    //                 options: [
    //                     { text: 'Attachment' }
    //                 ]
    //             },
    //             {
    //                 width: 176,
    //                 options: [
    //                     { text: 'Assign' }
    //                 ]
    //             },
    //             {
    //                 width: 64,
    //                 options: [
    //                     { text: 'Flag' }
    //                 ]
    //             }
    //         ]
    //     });
    // }
});
