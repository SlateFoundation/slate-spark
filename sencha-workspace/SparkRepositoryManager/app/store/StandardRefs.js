/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.store.StandardRefs', {
    extend: 'Ext.data.Store',

    requires: [
        'SparkRepositoryManager.model.StandardRef'
    ],

    model: 'SparkRepositoryManager.model.StandardRef',

    autoSync: true
});
