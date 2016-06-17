Ext.define('SparkClassroomTeacher.view.competencies.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-competencies-grid',
    requires: [
        'Jarvus.plugin.GridHeight',
        'Jarvus.plugin.GridFlex',
        'SparkClassroom.column.Sparkpoints',
        'SparkClassroom.column.Title',
        'SparkClassroom.column.StudentCompetency'
    ],

    config: {
        currentSection: null,
        plugins: [
            {
                type: 'gridheight',
                enableVertical: true
            }, {
                type: 'gridflex'
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