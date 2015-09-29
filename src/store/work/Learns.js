/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.work.Learns', {
    extend: 'Ext.data.Store',

    model: 'SparkClassroom.model.work.Learn',

    config: {
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
            connection: 'Ext.Ajax',
            url: './api-data/learns.json'
        }
    }
});