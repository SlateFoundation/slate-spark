/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.store.Assessments', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.Assessment'
    ],

    model: 'Spark2Manager.model.Assessment',

    autoSync: true
});
