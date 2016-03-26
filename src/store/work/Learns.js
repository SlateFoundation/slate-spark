/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.work.Learns', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.proxy.API'
    ],

    model: 'SparkClassroom.model.work.Learn',

    config: {
        autoSync: true,
        trackRemoved: false,
        // grouper: {
        //     property: 'Group',
        //     direction: 'DESC'
        // },

        // sorters: [
        //     {
        //         sorterFn: function(standard1) {
        //             switch (standard1) {
        //                 case 'Required':
        //                     return -1;
        //                 case 'AdditionOptions':
        //                     return 1;
        //             }
        //         }
        //     }
        // ],

        proxy: {
            type: 'slate-api',
            url: '/spark/api/work/learns'
        }
    }
});