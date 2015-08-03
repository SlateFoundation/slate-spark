/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.points.apply.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assign-points-apply-grid',
    config: {
        height: 500,
        columns:[
            {
                dataIndex: 'Title',
                //NOTE: x-grid horizontal flex broken 
                width: 100,
                text: 'Title'
            },
            {
                dataIndex: 'Standard',
                width: 100,
                text: 'Standards'
            },
            {
                dataIndex: 'Grade',
                width: 100,
                text: 'Grade'
            },
            {
                dataIndex: 'DOK',
                width: 100,
                text: 'DOK'
            },
            {
                dataIndex: 'CreatedBy',
                width: 100,
                text: 'Created By'
            },
            {
                dataIndex: 'Assign',
                width: 100,
                text: 'Assign',
                tpl: '<input type="checkbox" checked="{Assign}">'
            }
        ],

        store: 'assign.Apply'
    }
});