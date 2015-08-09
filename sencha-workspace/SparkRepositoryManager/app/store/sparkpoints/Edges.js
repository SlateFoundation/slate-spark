/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.store.sparkpoints.Edges', {
    extend: 'Ext.data.Store',

    model: 'SparkRepositoryManager.model.SparkpointEdge',
	remoteFilter: true,
	proxy: {
		type: 'spark-api',
		url: '/spark-repo/sparkpoint-edges',
		reader: {
			type: 'json',
			rootProperty: 'sparkpoints_edges'
		}
	}
});