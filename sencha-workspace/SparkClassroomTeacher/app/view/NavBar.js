Ext.define('SparkClassroomTeacher.view.NavBar', {
    extend: 'SparkClassroom.NavBar',
    xtype: 'spark-teacher-navbar',

    config: {
        items: [
            {
                text: 'Student Work',
                itemId: 'work'
            },
            {
                text: 'Competency Overview',
                itemId: 'competencies'
            },
            {
                text: 'Assign Sparkpoints',
                itemId: 'assign',
                disabled: true
            },
            {
                text: 'Activity',
                itemId: 'activity',
                disabled: true
            }
        ]
    }
});