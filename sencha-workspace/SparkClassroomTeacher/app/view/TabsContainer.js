Ext.define('SparkClassroomTeacher.view.TabsContainer', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-tabscontainer',
    requires: [
        'SparkClassroomTeacher.view.TabBar'
    ],

    config: {
        autoDestroy: false,
        cls: 'spark-teacher-tabscontainer',
        items: [
            {
                docked: 'top',

                xtype: 'spark-teacher-tabbar'
            }
        ]
    }
});