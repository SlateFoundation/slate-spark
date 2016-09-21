/* This is the store used in the Competencies feature, it contains ALL student sparkpoints for a section */
Ext.define('SparkClassroomTeacher.store.CompetencySparkpoints', {
    extend: 'SparkClassroomTeacher.store.StudentSparkpoints',

    proxy: {
        type: 'spark-studentsparkpoints',
        url: '/spark/api/work/activity',
        extraParams: {
            status: 'all'
        }
    },

    config: {
        // blow out the filter from StudentSparkpoint store we're extending
        filters: []
    }
});