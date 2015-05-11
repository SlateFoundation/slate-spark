/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.store.StandardRefs', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.StandardRef'
    ],

    model: 'Spark2Manager.model.StandardRef',

    autoSync: true
});
