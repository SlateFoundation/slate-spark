/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.assign.Assess', {
    extend: 'Ext.data.Store',


    config: {
        fields: [
            'sparkpoints',
            'title',
            'url',
            'grade',
            'Type',
            'Assign',
            'Vendor',
            'Issue'
        ],

        data: [
            {sparkpoints: ['4.LA.M.B','5.ZA.U.B'], url: 'http://link.com', title: 'What is this?', Type: 'Digital', grade: 11, Assign: false, Vendor: 'Brainpop', Issue: true},
            {sparkpoints: ['4.LA.M.B','5.ZA.U.B'], url: 'http://link.com', title: 'Playlist Title', Type: 'Teacher Directed', grade: 9, Assign: true, Vendor: 'Youtube', Issue: true},
            {sparkpoints: ['4.LA.M.B','5.ZA.U.B'], url: 'http://link.com', title: 'Playlist Title', Type: 'Teacher Directed', grade: 11, Assign: false, Vendor: 'Brainpop', Issue: false},
            {sparkpoints: ['4.LA.M.B','5.ZA.U.B'], url: 'http://link.com', title: 'Playlist Title', Type: 'Digital', grade: 9, Assign: true, Vendor: 'Youtube', Issue: false},
            {sparkpoints: ['4.LA.M.B'], url: 'http://link.com', title: 'What is that?', Type: 'Digital', grade: 11, Assign: false, Vendor: 'Brainpop', Issue: false},
            {sparkpoints: ['4.LA.M.B','5.ZA.U.B'], url: 'http://link.com', title: 'Playlist Title', Type: 'Teacher Directed', grade: 9, Assign: true, Vendor: 'PBS', Issue: true},
            {sparkpoints: ['4.LA.M.B','5.ZA.U.B'], url: 'http://link.com', title: 'Playlist Title', Type: 'Digital', grade: 11, Assign: false, Vendor: 'Brainpop', Issue: false},
            {sparkpoints: ['5.ZA.U.B'], url: 'http://link.com', title: 'Playlist Title', Type: 'Paper Quiz', grade: 9, Assign: true, Vendor: 'Illuminate', Issue: true},
            {sparkpoints: ['4.LA.M.B','5.ZA.U.B'], url: 'http://link.com', title: 'Playlist Title', Type: 'Digital', grade: 11, Assign: false, Vendor: 'Brainpop', Issue: false},
            {sparkpoints: ['4.LA.M.B','5.ZA.U.B'], url: 'http://link.com', title: 'Playlist Title', Type: 'Paper Quiz', grade: 9, Assign: true, Vendor: 'Youtube', Issue: false}
        ]
    }
});