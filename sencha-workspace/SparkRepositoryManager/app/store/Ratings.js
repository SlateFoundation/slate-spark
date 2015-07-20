/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.store.Ratings', {
    extend: 'Ext.data.Store',

    requires: [
        'SparkRepositoryManager.model.Rating'
    ],

    model: 'SparkRepositoryManager.model.Rating',

    autoSync: true
});
