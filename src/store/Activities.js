/* global Ext */
Ext.define('SparkClassroom.store.Activities', {
    extend: 'Ext.data.Store',


	model: 'SparkClassroom.model.StudentSparkpoint',
	proxy: {
		type: 'spark-studentsparkpoints',
		url: '/spark/api/work/activity',
		extraParams: {
			status: 'all'
		}
	}
});