/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.store.sparkpoints.Alignments', {
    extend: 'Ext.data.Store',

    model: 'SparkRepositoryManager.model.SparkpointAlignment',
	remoteFilter: true
});