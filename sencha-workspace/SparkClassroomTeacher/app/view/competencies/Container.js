Ext.define('SparkClassroomTeacher.view.competencies.Container', {
    extend: 'Ext.Container',
    requires: [
        'SparkClassroomTeacher.view.competencies.Grid'
    ],
    xtype: 'spark-competencies',

    config: {
        items: [
            {
                xtype: 'spark-competencies-grid'
            }
        ]
    }
});