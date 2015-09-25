/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.learn.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-work-learn-grid',
    requires: [
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight',
        'SparkClassroom.column.Completed',
        'SparkClassroom.column.Learn',
        'SparkClassroom.column.DOK',
        'SparkClassroom.column.LearnType',
        'SparkClassroom.column.Rating',
        'SparkClassroom.column.Score',
        'SparkClassroom.column.Attachment'
    ],

    config: {
        plugins: [
            'gridflex',
            'gridheight'
        ],
        grouped: true,
        titleBar: null,
        columns:[
            {
                dataIndex: 'completed',
                xtype: 'spark-completed-column'
            },
            {
                dataIndex: 'title',
                xtype: 'spark-title-column',
                flex: 2
            },
            {
                dataIndex: 'dok',
                xtype: 'spark-dok-column'
            },
            {
                dataIndex: 'category',
                xtype: 'spark-learntype-column'
            },
            {
                dataIndex: 'rating',
                xtype: 'spark-rating-column'
            },
            {
                dataIndex: 'score',
                xtype: 'spark-score-column'
            },
            {
                dataIndex: 'attachments',
                xtype: 'spark-attachment-column'
            }
        ],

        store: {
            fields: [
                'type',
                'completed',
                'title',
                'url',
                'dok',
                'rating',
                'score',
                'attachments',
                'vendor',
                {
                    name: 'srating',
                    convert: function(v, r) {
                        var rating = r.get('rating');

                        return rating ? rating.student : null;
                    }
                },
                {
                    name: 'trating',
                    convert: function(v, r) {
                        var rating = r.get('rating');

                        return rating ? rating.teacher : null;
                    }
                }
             ],
             data: [
                {Group: 'Additional Options', Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Video', Rating: {Teacher: 4, Student: 2}, Score: null, Attachment: 'A link of doc'}
            ],

            grouper: {
                property: 'Group',
                direction: 'DESC'
            },
            sorters: [
                {
                    sorterFn: function(standard1) {
                        switch (standard1) {
                            case 'Required':
                                return -1;
                            case 'AdditionOptions':
                                return 1;
                        }
                    }
                }
            ],
            proxy: {
                type: 'api',
                url: 'https://api.matchbooklearning.com/content/learns?sparkpoints=MATH.GK.NBT.1'
            }
        }
    }
});
