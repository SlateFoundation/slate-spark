/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.store.ApplyLinks', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.ApplyLink'
    ],

    model: 'Spark2Manager.model.ApplyLink',

    autoSync: true
});
