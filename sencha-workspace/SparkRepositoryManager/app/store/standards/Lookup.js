/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.store.standards.Lookup', {
    extend: 'Ext.data.Store',
	alias: 'store.standards-lookup',

	requires: [
		'SparkRepositoryManager.proxy.API'
	],

	model: 'SparkRepositoryManager.model.Standard',

	proxy: {
		type: 'spark-api',
		url: '/spark-repo/standards',
		headers: {
			Prefer: 'return=minimal'
		}
	}
});