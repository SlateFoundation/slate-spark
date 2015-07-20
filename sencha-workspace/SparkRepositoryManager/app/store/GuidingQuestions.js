/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.store.GuidingQuestions', {
    extend: 'Ext.data.Store',

    requires: [
        'SparkRepositoryManager.model.GuidingQuestion'
    ],

    model: 'SparkRepositoryManager.model.GuidingQuestion',

    autoSync: true,

    pageSize: 25,

    sorters:[
        {
            property:'Created',
            direction:'DESC'
        },
        {
            property:'Creator',
            direction:'DESC'
        }
    ],

    remoteSort: true,
    remoteFilter: true
});
