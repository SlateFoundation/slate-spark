/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.points.assess.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assign-points-assess-grid',

    config: {
        title: 'Assess',
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
                dataIndex: 'Vendor',
                flex: 1,
                text: 'Vendor',
                renderTpl: function(v, m, r) {
                    return '<img src="http://placehold.it/25x25">'+v;
                }
            },
            {
                dataIndex: 'Assign',
                text: 'Assign',
                flex: 1,
                renderTpl: function(v, m, r) {
                    return '<input type="checkbox" checked="'+v+'">';
                }
            },
            {
                dataIndex: 'Issue',
                text: 'Issue',
                flex: 1,
                renderTpl: function(v, m, r) {
                    return '<img src="http://placehold.it/25x25">';
                }
            }
        ],

        store: {
            fields: ['Standard','Link', 'Title', 'Grade', 'Type', 'Assign', 'Vendor', 'Issue'],


            data: [
                {Standard: '5.LA.M.B', Link: 'http://link.com', Title: 'What is this?', Type: 'Digital', Grade: 11, Assign: false, Vendor: 'Brainpop', Issue: true},
                {Standard: '5.LA.M.B', Link: 'http://link.com', Title: 'Playlist Title', Type: 'Teacher Directed', Grade: 9, Assign: true, Vendor: 'Youtube', Issue: true},
                {Standard: '5.LA.M.B', Link: 'http://link.com', Title: 'Playlist Title', Type: 'Teacher Directed', Grade: 11, Assign: false, Vendor: 'Brainpop', Issue: false},
                {Standard: '5.LA.M.B', Link: 'http://link.com', Title: 'Playlist Title', Type: 'Digital', Grade: 9, Assign: true, Vendor: 'Youtube', Issue: false},
                {Standard: '6.LA.M.B', Link: 'http://link.com', Title: 'What is that?', Type: 'Digital', Grade: 11, Assign: false, Vendor: 'Brainpop', Issue: false},
                {Standard: '5.LA.M.B', Link: 'http://link.com', Title: 'Playlist Title', Type: 'Teacher Directed', Grade: 9, Assign: true, Vendor: 'PBS', Issue: true},
                {Standard: '3.LA.M.B', Link: 'http://link.com', Title: 'Playlist Title', Type: 'Digital', Grade: 11, Assign: false, Vendor: 'Brainpop', Issue: false},
                {Standard: '5.LA.M.B', Link: 'http://link.com', Title: 'Playlist Title', Type: 'Paper Quiz', Grade: 9, Assign: true, Vendor: 'Illuminate', Issue: true},
                {Standard: 'e.LA.M.B', Link: 'http://link.com', Title: 'Playlist Title', Type: 'Digital', Grade: 11, Assign: false, Vendor: 'Brainpop', Issue: false},
                {Standard: '5.LA.M.B', Link: 'http://link.com', Title: 'Playlist Title', Type: 'Paper Quiz', Grade: 9, Assign: true, Vendor: 'Youtube', Issue: false},
            ]
        }
    }
});