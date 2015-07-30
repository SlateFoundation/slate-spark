/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.points.apply.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assign-points-apply-grid',
    //NOTE: div.inner doesn't use full hight of div.x-grid. This in tandom with the width errors seems to cause cells to hide.
    config: {

        columns:[
            {
                dataIndex: 'Title',
                //NOTE: x-grid-cells width broken and can only be set in the inspector
                width: 100,
                text: 'Title'
            },
            {
                dataIndex: 'Standard',
                text: 'Standards'
            },
            {
                dataIndex: 'Grade',
                text: 'Grade'
            },
            {
                dataIndex: 'DOK',
                text: 'DOK'
            },
            {
                dataIndex: 'CreatedBy',
                text: 'Created By'
            },
            {
                dataIndex: 'Assign',
                text: 'Assign',
                renderer: function(v, r) {
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