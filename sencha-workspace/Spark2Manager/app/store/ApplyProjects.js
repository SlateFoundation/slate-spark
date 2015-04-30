/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.store.ApplyProjects', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.ApplyProject'
    ],

    model: 'Spark2Manager.model.ApplyProject',

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
