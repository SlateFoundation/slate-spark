/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.store.GuidingQuestions', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.GuidingQuestion'
    ],

    model: 'Spark2Manager.model.GuidingQuestion',

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
