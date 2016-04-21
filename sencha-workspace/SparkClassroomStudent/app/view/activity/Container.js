Ext.define('SparkClassroomStudent.view.activity.Container', {
    extend: 'SparkClassroom.NavSubpanel',
    xtype: 'spark-activity',
    requires: [
        'SparkClassroom.activity.ActivityList'
    ],

    config: {
        width: 300,
        items: [
            {
                xtype: 'spark-activity-list',
                itemTpl: [
                    '<strong class="activity-verb">Completed L&P</strong> ',
                    '<span class="activity-preposition">of</span> ',
                    '<span class="activity-object activity-standard">CC.SS.Math.Content.1.OA.A.1</span>'
                ]
            }
        ]
    }
});