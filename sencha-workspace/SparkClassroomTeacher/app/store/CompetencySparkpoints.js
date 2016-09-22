/* This is the store used in the Competencies feature, it contains ALL student sparkpoints for a section */
Ext.define('SparkClassroomTeacher.store.CompetencySparkpoints', {
    extend: 'Ext.data.Store',


    model: 'SparkClassroom.model.StudentSparkpoint',

    proxy: {
        type: 'spark-studentsparkpoints',
        url: '/spark/api/sparkpoints'
    }
});