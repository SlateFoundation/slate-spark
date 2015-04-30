/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.store.TagMaps', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.TagMap'
    ],

    model: 'Spark2Manager.model.TagMap',

    autoSync: true
});
