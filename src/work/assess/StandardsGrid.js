/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.assess.StandardsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-work-assess-standardsgrid',

    config: {

        columns:[
            {
                dataIndex: 'Standard',
                flex: 1,
                text: 'Assessment Selected'
            },
            {
                dataIndex: 'Completed',
                flex: 1,
                text: 'Completed',
                renderTpl: function(v, m, r) {
                    return v ? '<input type="checkbox" checked>' : '';
                }
            },
            {
                dataIndex: 'Score',
                text: 'Score',
                renderTpl: function(v, m, r) {
                    return v ? v+'/5' : '';
                },
                flex: 1
            }
        ],

        store: {
            fields: ['Standard', 'Completed', 'Score'],

            data: [
                {Standard: 'Playlist Title', Rating: false, Comleted: false},
                {Standard: 'Playlist Title', Rating: 2, Completed: true}
            ]
        }
    }
});