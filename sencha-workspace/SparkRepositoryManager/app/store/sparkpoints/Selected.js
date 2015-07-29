/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.store.sparkpoints.Selected', {
    extend: 'Ext.data.Store',
	singleton: true,

	storeId: 'sparkpoints-selected',
    model: 'SparkRepositoryManager.model.Sparkpoint',
	remoteSort: true,
	sorters: 'code'
});