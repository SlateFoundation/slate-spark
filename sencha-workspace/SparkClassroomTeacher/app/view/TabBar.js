Ext.define('SparkClassroomTeacher.view.TabBar', {
    extend: 'Ext.tab.Bar',
    xtype: 'spark-teacher-tabbar',

    config: {
        cls: 'spark-teacher-tabbar',

        layout: {
            type: 'hbox',
            align: 'stretch',
            pack: 'center'
        },

        defaults: {
            flex: 1
        },

        items: [
            {
                title: 'Student Work',
                itemId: 'work'
            },
            {
                title: 'Competency Overview <small>Coming Soon</small>',
                itemId: 'competencies',
                disabled: !location.search.match(/\WenableAlpha(\W|$)/)
            },
            {
                title: 'Assign',
                itemId: 'assign'
            }
        ]
    }
});