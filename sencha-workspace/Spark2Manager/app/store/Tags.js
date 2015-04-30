/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.store.Tags', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.Tag'
    ],

    model: 'Spark2Manager.model.Tag',

    autoSync: true
});
