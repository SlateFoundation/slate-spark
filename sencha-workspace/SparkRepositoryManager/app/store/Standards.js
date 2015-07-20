/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.store.Standards', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.Standard'
    ],

    model: 'Spark2Manager.model.Standard',

    autoSync: true
});
