/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.store.Assessments', {
    extend: 'Ext.data.Store',

    requires: [
        'SparkRepositoryManager.model.Assessment'
    ],

    model: 'SparkRepositoryManager.model.Assessment',

    autoSync: true,

    sorters:[
        {
            property:'Created',
            direction:'DESC'
        }
    ],

    remoteSort: true,
    remoteFilter: true
});
