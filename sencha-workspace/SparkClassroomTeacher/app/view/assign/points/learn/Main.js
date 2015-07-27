/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.points.learn.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-assign-points-learn',
    requires: [
        'SparkClassroomTeacher.view.assign.points.learn.Grid'
    ],

    config: {
        title: 'Learn &amp; Practice',
        height: 500,
        layout: 'fit',
        items: [
            {
                xtype: 'container',
                layout: 'vbox',
                items: [
                    {
                        xtype: 'selectfield',
                        label: 'Number of Learns required for CCSS.ELA.3.CC.4.A',
                        options: [
                            {text: 'Between 1-2', value: 1},
                            {text: 'Between 3-7', value: 1},
                            {text: 'Between 8-12', value: 1}
                        ]
                    },
                    {
                        xtype: 'spark-assign-points-learn-grid'
                    }
                ]
            }
        ]
    }
});