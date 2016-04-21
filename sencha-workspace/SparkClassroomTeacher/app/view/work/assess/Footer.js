Ext.define('SparkClassroomTeacher.view.work.assess.Footer', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-work-assess-footer',
    requires: [
        'SparkClassroom.widget.SparkpointField',
        'SparkClassroom.store.SparkpointsLookup'
    ],

    config: {
        layout: 'hbox',
        defaults: {
            xtype: 'button',
            ui: 'action'
        },
        items: [
            {
                text: 'Assign Learns',
                margin: '0 16 0 0',
                disabled: true
            },
            {
                text: 'Schedule Interaction',
                disabled: true
            },
            {
                xtype: 'component',
                flex: 1
            },
            {
                xtype: 'spark-sparkpointfield',
                placeHolder: 'Suggest Next Sparkpoint'
            },
            {
                itemId: 'completeBtn',

                text: 'Mark Standard Complete',
                iconCls: 'fa fa-check'
            }
        ]
    }
});