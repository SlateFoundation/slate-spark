/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.store.Standards', {
    extend: 'Ext.data.Store',

    requires: [
        'SparkRepositoryManager.model.Standard'
    ],

    model: 'SparkRepositoryManager.model.Standard',

    autoSync: true
});
