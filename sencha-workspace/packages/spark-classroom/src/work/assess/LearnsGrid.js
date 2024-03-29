/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.assess.LearnsGrid', {
    extend: 'SparkClassroom.EditableGrid',
    xtype: 'spark-work-assess-learnsgrid',
    requires: [
        'Ext.data.ChainedStore',
        'Jarvus.plugin.GridHeight',
        'SparkClassroom.column.Link',
        'SparkClassroom.column.StudentRating',
        'SparkClassroom.column.StudentComment'
    ],

    config: {
        plugins: [
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
            },
            {
                xtype: 'spark-column-studentcomment'
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