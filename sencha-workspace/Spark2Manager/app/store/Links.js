/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.store.Links', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.Link'
    ],

    model: 'Spark2Manager.model.Link',

    autoSync: true
});
