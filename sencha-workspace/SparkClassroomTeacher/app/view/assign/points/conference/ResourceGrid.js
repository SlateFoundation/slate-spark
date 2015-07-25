/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.points.conference.ResourceGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assign-points-conference-resourcegrid',

    config: {
        title: 'Conference Resources',
        columns:[
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
                dataIndex: 'Link',
                flex: 1,
                text: 'Url'
            },
            {
                dataIndex: 'Title',
                flex: 1,
                text: 'Title'
            },
            {
                dataIndex: 'Created',
                text: 'Created',
                flex: 1
            },
            {
                dataIndex: 'CreatedBy',
                text: 'Created By',
                flex: 1
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
            fields: ['Standard','Link', 'Title', 'Grade', 'Created', 'CreatedBy', 'Assign'],


            data: [
                {Standard: '5.LA.M.B', Link: 'http://link.com', Title: 'What is this?', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
                {Standard: '5.LA.M.B', Link: 'http://link.com', Title: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 9, Assign: true},
                {Standard: '5.LA.M.B', Link: 'http://link.com', Title: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
                {Standard: '5.LA.M.B', Link: 'http://link.com', Title: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 9, Assign: true},
                {Standard: '6.LA.M.B', Link: 'http://link.com', Title: 'What is that?', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
                {Standard: '5.LA.M.B', Link: 'http://link.com', Title: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 9, Assign: true},
                {Standard: '3.LA.M.B', Link: 'http://link.com', Title: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
                {Standard: '5.LA.M.B', Link: 'http://link.com', Title: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 9, Assign: true},
                {Standard: 'e.LA.M.B', Link: 'http://link.com', Title: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
                {Standard: '5.LA.M.B', Link: 'http://link.com', Title: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 9, Assign: true}
            ]
        }
    }
});