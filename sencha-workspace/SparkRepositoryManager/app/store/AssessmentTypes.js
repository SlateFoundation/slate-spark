/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.store.AssessmentTypes', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.AssessmentType'
    ],

    model: 'Spark2Manager.model.AssessmentType',

    autoSync: true
});
