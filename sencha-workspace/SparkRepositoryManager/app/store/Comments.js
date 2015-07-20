/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.store.Comments', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.Comment'
    ],

    model: 'Spark2Manager.model.Comment',

    autoSync: true
});
