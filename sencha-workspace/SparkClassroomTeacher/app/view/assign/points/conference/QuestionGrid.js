/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.points.conference.QuestionGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assign-points-conference-questiongrid',

    config: {
        title: 'Conference Questions',
        columns:[
            {
                dataIndex: 'Standard',
                flex: 1,
                text: 'Standards',
            },
            {
                dataIndex: 'Grade',
                flex: 1,
                text: 'Grade'
            },
            {
                dataIndex: 'Question',
                flex: 1,
                text: 'Guiding Questions'
            },
            {
                dataIndex: 'Created',
                text: 'Created',
                flex: 1,
            },
            {
                dataIndex: 'CreatedBy',
                text: 'Created By',
                flex: 1,
            },
            {
                dataIndex: 'Assign',
                text: 'Assign',
                flex: 1,
                renderTpl: function(v, m, r) {
                    return '<input type="checkbox" checked="'+v+'">';
                }
            }
        ],

        store: {
            fields: ['Standard','Question', 'Grade', 'Created', 'CreatedBy', 'Assign'],


            data: [
                {Standard: '5.LA.M.B', Question: 'What is this?', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
                {Standard: '5.LA.M.B', Question: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 9, Assign: true},
                {Standard: '5.LA.M.B', Question: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
                {Standard: '5.LA.M.B', Question: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 9, Assign: true},
                {Standard: '6.LA.M.B', Question: 'What is that?', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
                {Standard: '5.LA.M.B', Question: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 9, Assign: true},
                {Standard: '3.LA.M.B', Question: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
                {Standard: '5.LA.M.B', Question: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 9, Assign: true},
                {Standard: 'e.LA.M.B', Question: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
                {Standard: '5.LA.M.B', Question: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 9, Assign: true},
            ]
        }
    }
});