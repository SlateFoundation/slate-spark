Ext.define('SparkClassroomTeacher.store.gps.ActiveStudents', {
    extend: 'SparkClassroomTeacher.store.StudentSparkpoints',
    requires: [
        'Slate.proxy.API'
    ],


    config: {
        // filter out activity that didn't match a student in the active roster
        filters: [{
            filterFn: function(r) {
                return r.get('student');
            }
        }]
    }
});