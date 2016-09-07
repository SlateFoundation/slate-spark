/* global Ext */
Ext.define('SparkClassroom.store.Activities', {
    extend: 'Ext.data.Store',


	model: 'SparkClassroom.model.StudentSparkpoint',
	proxy: {
		type: 'slate-api',
		url: '/spark/api/work/activity',
		batchActions: false,
		extraParams: {
			status: 'all'
		},
		writer: {
			type: 'json',
			allowSingle: true
		}
	}
});