/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.apply.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assign-apply-grid',
    config: {
        height: 500,
        titleBar: null,
        columns:[
            {
                dataIndex: 'Title',
                //NOTE: x-grid horizontal flex broken 
                width: 100,
                text: 'Title'
            },
            {
                dataIndex: 'Standards',
                text: 'Standards',
                tpl: '{[values.Standards ? values.Standards.join(", ") : ""]}',
                width: 100
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
                tpl: '<input type="checkbox" checked="{Assign}">',
                cell: {
                    encodeHtml: false
                }
            }
        ],

        store: 'assign.Apply'
    }
});