/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.assess.LearnsGrid', {
    extend: 'SparkClassroom.EditableGrid',
    xtype: 'spark-work-assess-learnsgrid',
    requires: [
        'Ext.data.ChainedStore',
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight',
        'SparkClassroom.column.Link',
        'SparkClassroom.column.StudentRating',
        'SparkClassroom.column.StudentComment'
    ],

    config: {
        plugins: [
            'gridflex',
            'gridheight'
        ],
        titleBar: null,
        emptyText: 'Once some Learns have been marked completed, you’ll be able to rate them here.',

        columns:[
            {
                xtype: 'spark-link-column',
                text: 'Learn'
            },
            {
                xtype: 'spark-column-studentrating'
            }
        ],

        store: {
            type: 'chained',
            source: 'work.Learns',
            filters: [
                {
                    filterFn: function(learn) {
                        return learn.get('completed');
                    }
                }
            ]
        }
    }
});