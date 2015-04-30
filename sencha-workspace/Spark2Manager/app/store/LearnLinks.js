/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.store.LearnLinks', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.LearnLink'
    ],

    model: 'Spark2Manager.model.LearnLink',

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
