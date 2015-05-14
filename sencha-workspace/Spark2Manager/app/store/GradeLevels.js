/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.store.GradeLevels', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.GradeLevel'
    ],

    model: 'Spark2Manager.model.GradeLevel',

    autoSync: true
});
