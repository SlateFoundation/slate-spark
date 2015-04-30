/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.store.Ratings', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.Rating'
    ],

    model: 'Spark2Manager.model.Rating',

    autoSync: true
});
