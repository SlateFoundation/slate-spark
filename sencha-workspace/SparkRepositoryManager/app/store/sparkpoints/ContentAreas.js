/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.store.sparkpoints.ContentAreas', {
    extend: 'Ext.data.TreeStore',
	singleton: true,

	storeId: 'sparkpoints-contentareas',
    model: 'SparkRepositoryManager.model.ContentArea',
	remoteSort: true,
	sorters: 'code',
	nodeParam: null
});