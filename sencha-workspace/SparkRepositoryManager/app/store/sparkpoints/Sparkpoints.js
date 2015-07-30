/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.store.sparkpoints.Sparkpoints', {
    extend: 'Ext.data.Store',
    storeId: 'sparkpoints.Sparkpoints',

    model: 'SparkRepositoryManager.model.sparkpoint.Sparkpoint',

    data: [
        { ID: 1, code: 'K.CC.1', title: 'Count to 100 by ones and by tens.', M: 'K.CC.4a' },
        { ID: 2, code: 'K.CC.4a', title: 'Understand how to stop counting', M: 'K.CC.3a' },
        { ID: 3, code: 'K.CC.4b', title: 'Counting tiny numbers', M: 'K.G.1,2' },
        { ID: 4, code: 'K.G.1,2', title: 'Counting big numbers', M: 'K.G.2,1' }
    ]

});
