/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.store.sparkpoints.Alignments', {
    extend: 'Ext.data.Store',

    model: 'SparkRepositoryManager.model.SparkpointAlignment',
	remoteFilter: true,
	proxy: {
		type: 'spark-api',
		url: '/spark-repo/sparkpoint-alignments',
		extraParams: {
			include: 'standard'
		}
	}
});