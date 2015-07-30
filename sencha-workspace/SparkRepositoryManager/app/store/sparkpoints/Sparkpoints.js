/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.store.sparkpoints.Sparkpoints', {
    extend: 'Ext.data.Store',
    storeId: 'sparkpoints.Sparkpoints',

    requires: [
        'SparkRepositoryManager.model.Sparkpoint',
        'SparkRepositoryManager.proxy.Records' // TODO: assuming we will need this when store is real, delete if not
    ],

    model: 'SparkRepositoryManager.model.Sparkpoint',

    data: [
        { ID: 1, Code: 'K.CC.1', Description: 'Count to 100 by ones and by tens.', M: 'K.CC.4a' },
        { ID: 2, Code: 'K.CC.4a', Description: 'Understand how to stop counting', M: 'K.CC.3a' },
        { ID: 3, Code: 'K.CC.4b', Description: 'Counting tiny numbers', M: 'K.G.1,2' },
        { ID: 4, Code: 'K.G.1,2', Description: 'Counting big numbers', M: 'K.G.2,1' }
    ]

/*
    // TODO: make this store real
    autoSync: true,

    proxy: {
        type: 'spark-records',
        url: '/spark2/sparkpoints'
    }
*/
});
