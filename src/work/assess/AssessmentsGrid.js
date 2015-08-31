/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.assess.AssessmentsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-work-assess-assessmentsgrid',

    config: {
        width: 500,
        height: 200,
        titleBar: null,
        columns:[
            {
                dataIndex: 'Standard',
                width: 150,
                text: 'Assessment Selected'
            },
            {
                dataIndex: 'Completed',
                width: 50,
                text: 'Completed',
                tpl: '<input type="checkbox" checked="{Completed}">'
            },
            {
                dataIndex: 'Score',
                text: 'Score',
                renderer: function(v, r) {
                    return v ? v+'/5' : '';
                },
                width: 50
            }
        ],

        store: {
            fields: ['Standard', 'Completed', 'Score'],

            data: [
                {Standard: 'Playlist Title', Score: false, Comleted: false},
                {Standard: 'Playlist Title', Score: 2, Completed: true}
            ]
        }
    }
});