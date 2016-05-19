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
                itemId: 'competencies',
                disabled: !location.search.match(/\WenableAlpha(\W|$)/)
            },
            {
                text: 'Assign Sparkpoints',
                itemId: 'assign'
            },
            {
                text: 'Activity',
                itemId: 'activity',
                disabled: !location.search.match(/\WenableAlpha(\W|$)/)
            }
        ]
    }
});