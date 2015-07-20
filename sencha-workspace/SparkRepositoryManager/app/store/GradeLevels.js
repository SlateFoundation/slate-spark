/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('SparkRepositoryManager.store.GradeLevels', {
    extend: 'Ext.data.Store',

    requires: [
        'SparkRepositoryManager.model.GradeLevel'
    ],

    model: 'SparkRepositoryManager.model.GradeLevel',

    autoSync: true
});
