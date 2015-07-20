/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.store.ConferenceResources', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.ConferenceResource'
    ],

    model: 'Spark2Manager.model.ConferenceResource',

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
