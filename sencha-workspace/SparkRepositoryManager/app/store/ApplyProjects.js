/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.store.ApplyProjects', {
    extend: 'Ext.data.Store',

    requires: [
        'SparkRepositoryManager.model.ApplyProject'
    ],

    model: 'SparkRepositoryManager.model.ApplyProject',

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
