/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.store.GuidingQuestions', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.GuidingQuestion'
    ],

    model: 'Spark2Manager.model.GuidingQuestion',

    pageSize: 5
});
