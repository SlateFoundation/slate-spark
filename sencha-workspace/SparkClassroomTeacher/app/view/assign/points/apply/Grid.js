/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.points.apply.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assign-points-apply-grid',

    config: {

        columns:[
            {
                dataIndex: 'Title',
                flex: 1,
                text: 'Title'
            },
            {
                dataIndex: 'Standard',
                flex: 1,
                text: 'Standards'
            },
            {
                dataIndex: 'Grade',
                flex: 1,
                text: 'Grade'
            },
            {
                dataIndex: 'DOK',
                flex: 1,
                text: 'DOK'
            },
            {
                dataIndex: 'CreatedBy',
                flex: 1,
                text: 'Created By'
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
            fields: ['Standard', 'Title', 'Grade', 'Assign', 'CreatedBy', 'DOK'],


            data: [
                {Standard: '5.LA.M.B', Title: 'What is this?', DOK: 3, CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
                {Standard: '5.LA.M.B', Title: 'Playlist Title', DOK: 2, CreatedBy: 'Milton Jossund', Grade: 9, Assign: true},
                {Standard: '5.LA.M.B', Title: 'Playlist Title', DOK: 3, CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
                {Standard: '5.LA.M.B', Title: 'Playlist Title', DOK: 1, CreatedBy: 'Milton Jossund', Grade: 9, Assign: true},
                {Standard: '6.LA.M.B', Title: 'What is that?', DOK: 3, CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
                {Standard: '5.LA.M.B', Title: 'Playlist Title', DOK: 3, CreatedBy: 'Milton Jossund', Grade: 9, Assign: true},
                {Standard: '3.LA.M.B', Title: 'Playlist Title', DOK: 3, CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
                {Standard: '5.LA.M.B', Title: 'Playlist Title', DOK: 1, CreatedBy: 'Milton Jossund', Grade: 9, Assign: true},
                {Standard: 'e.LA.M.B', Title: 'Playlist Title', DOK: 2, CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
                {Standard: '5.LA.M.B', Title: 'Playlist Title', DOK: 1, CreatedBy: 'Milton Jossund', Grade: 9, Assign: true}
            ]
        }
    }
});