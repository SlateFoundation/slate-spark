Ext.define('SparkClassroomTeacher.view.competencies.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-competencies-grid',
    requires: [
        'Jarvus.plugin.GridHeight',
        'SparkClassroom.column.Sparkpoints',
        'SparkClassroom.column.Title',
        'SparkClassroom.column.StudentCompetency'
    ],

    config: {
        cls: 'spark-competencies-grid',
        currentSection: null,
        plugins: [
            {
                type: 'gridheight',
                enableHorizontalScroll: true
            }
        ],
        titleBar: null,
        store: {
            fields: [{
                name: 'id'
            },{
                name: 'sparkpoint'
            }]
        },

        columns:[
            {
                xtype: 'spark-sparkpoints-column'
            }
        ]
    }
});