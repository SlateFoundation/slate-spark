/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.learn.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assign-learn-grid',
    requires: [
        'Jarvus.plugin.GridFlex',
        'Ext.grid.plugin.PagingToolbar',
        'SparkClassroom.widget.GridColumnFilter',
        'SparkClassroom.column.Standards',
        'SparkClassroom.column.Grade',
        'SparkClassroom.column.Learn',
        'SparkClassroom.column.LearnType',
        'SparkClassroom.column.DOK',
        'SparkClassroom.column.Rating',
        'SparkClassroom.column.Attachment',
        'SparkClassroom.column.AssignMulti',
        'SparkClassroom.column.Flag'
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
                dataIndex: 'Standards',
                xtype: 'spark-standards-column'
            },
            {
                dataIndex: 'Grade',
                xtype: 'spark-grade-column'
            },
            {
                flex: 2,
                dataIndex: 'Title',
                xtype: 'spark-learn-column'
            },
            {
                dataIndex: 'Category',
                xtype: 'spark-learntype-column'
            },
            {
                dataIndex: 'DOK',
                xtype: 'spark-dok-column'
            },
            {
                dataIndex: 'SRating',
                xtype: 'spark-rating-column'
            },
            {
                dataIndex: 'Attachment',
                xtype: 'spark-attachment-column'
            },
            {
                dataIndex: 'Assign',
                xtype: 'spark-assign-column-multi'
            },
            {
                dataIndex: 'Flag',
                xtype: 'spark-flag-column'
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
                    width: 208,
                    options: [
                        { text: 'Standards' }
                    ]
                },
                {
                    width: 80,
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
                    width: 176,
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
