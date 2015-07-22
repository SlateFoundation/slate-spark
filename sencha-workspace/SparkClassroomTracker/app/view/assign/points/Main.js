/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.points.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-assign-points',
    requires: [
        'SparkClassroomTeacher.view.assign.points.learn.Main',
        'SparkClassroomTeacher.view.assign.points.conference.ResourceGrid',
        'SparkClassroomTeacher.view.assign.points.conference.QuestionGrid',
        'SparkClassroomTeacher.view.assign.points.apply.Main',
        'SparkClassroomTeacher.view.assign.points.assess.Grid'
    ],

    config: {
        height: 500,
        layout: 'fit',
        items: [
            {
                xtype: 'tabpanel',
                items: [
                    {
                        xtype: 'spark-assign-points-learn'
                    },
                    {
                        xtype: 'spark-assign-points-conference-resourcegrid'
                    },
                    {
                        xtype: 'spark-assign-points-conference-questiongrid'
                    },
                    {
                        xtype: 'spark-assign-points-apply'
                    },
                    {
                        xtype: 'spark-assign-points-assess-grid'
                    }
                ]
            }
        ]
    }
});