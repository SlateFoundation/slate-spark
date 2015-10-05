/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.assess.LearnsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-work-assess-learnsgrid',
    requires: [
        'Ext.data.ChainedStore',
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight',
        'SparkClassroom.column.Learn'
    ],

    config: {
        plugins: [
            'gridflex',
            'gridheight'
        ],
        titleBar: null,
        emptyText: 'Once some learns have been marked completed, you&rsquo;ll be able to rate them here',

        columns:[
            {
                dataIndex: 'Title',
                xtype: 'spark-learn-column'
            },
            {
                dataIndex: 'Rating',
                width: 112,
                text: 'Your Rating'
            },
            {
                dataIndex: 'Comment',
                text: 'Comments',
                flex: 1
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