/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.work.Learns', {
    extend: 'Ext.data.Store',
    requires: [
        'Jarvus.proxy.API'
    ],

    model: 'SparkClassroom.model.work.Learn',

    config: {
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
            url: 'https://api.matchbooklearning.com/content/learns'
        }
    }
});