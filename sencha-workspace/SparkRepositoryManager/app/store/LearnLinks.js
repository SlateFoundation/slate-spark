/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.store.LearnLinks', {
    extend: 'Ext.data.Store',

    requires: [
        'SparkRepositoryManager.model.LearnLink'
    ],

    model: 'SparkRepositoryManager.model.LearnLink',

    autoSync: true,

    pageSize: 25,

    sorters:[
        {
            property:'Created',
            direction:'DESC'
        }
    ],

    remoteSort: true,
    remoteFilter: true
});
