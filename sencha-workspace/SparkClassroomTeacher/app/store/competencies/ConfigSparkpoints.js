/**
 * Provides a store for sparkpoints for a specific student being configured through the SparkpointsConfigWindow.
 */
Ext.define('SparkClassroomTeacher.store.competencies.ConfigSparkpoints', {
	extend: 'Ext.data.Store',
	alias: 'store.spark-configsparkpoints',

	config: {
		model: 'SparkClassroom.model.StudentSparkpoint',

		proxy: {
			type: 'spark-studentsparkpoints',
			url: '/spark/api/sparkpoints'
		}
	}
});