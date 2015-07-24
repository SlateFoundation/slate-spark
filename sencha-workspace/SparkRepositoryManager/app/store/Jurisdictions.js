/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.store.Jurisdictions', {
    extend: 'Ext.data.TreeStore',

    requires: [
        'SparkRepositoryManager.model.Jurisdiction'
    ],

    model: 'SparkRepositoryManager.model.Jurisdiction'
});
