/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.assess.AssessmentsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-work-assess-assessmentsgrid',
    requires: [
        'SparkClassroom.plugin.GridFlex'
    ],

    config: {
        plugins: [
            'gridflex'
        ],
        height: 200, // TODO remove height when possible
        titleBar: null,
        columns:[
            {
                dataIndex: 'Standard',
                flex: 1,
                text: 'Assessment Selected'
            },
            {
                dataIndex: 'Completed',
                width: 120,
                text: 'Completed',
                tpl: '<input type="checkbox" checked="{Completed}">',
                cell: {
                    encodeHtml: false
                }
            },
            {
                dataIndex: 'Score',
                text: 'Score',
                renderer: function(v, r) {
                    return v ? v+'/5' : '';
                },
                width: 120
            }
        ],

        store: {
            fields: [ 'Standard', 'Completed', 'Score' ],

            data: [
                {
                    Standard: 'Playlist Title',
                    Score: false,
                    Completed: false
                },
                {
                    Standard: 'Playlist Title',
                    Score: 2,
                    Completed: true
                }
            ]
        }
    }
});