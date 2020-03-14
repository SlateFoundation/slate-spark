/* This is the store used in the Competencies feature, it contains ALL student sparkpoints for a section */
Ext.define('SparkClassroomTeacher.store.CompetencySparkpoints', {
    extend: 'Ext.data.Store',


    model: 'SparkClassroom.model.StudentSparkpoint',

    proxy: {
        type: 'spark-studentsparkpoints',
        url: '/spark/api/sparkpoints'
    },

    config: {
        filters: [{
            filterFn: function(rec) {
                // filter out records with no student_id or sparkpoint_id to avoid data inconsistency errors
                return rec.get('student_id') !== null && rec.get('sparkpoint_id') !== null;
            }
        }]
    }
});