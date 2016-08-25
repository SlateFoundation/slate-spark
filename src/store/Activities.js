/* global Ext */
Ext.define('SparkClassroom.store.Activities', {
    extend: 'Ext.data.Store',

    proxy: {
		type: 'slate-api',
		url: '/spark/api/work/activity',
		extraParams: {
			status: 'all'
		}
	}
});