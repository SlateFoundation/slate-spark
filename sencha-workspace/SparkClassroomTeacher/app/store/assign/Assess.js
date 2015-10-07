/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.assign.Assess', {
    extend: 'Ext.data.Store',


    config: {
        fields: [
            'sparkpoints',
            'title',
            'url',
            'grade',
            'type',
            'assign',
            'vendor',
            'issue'
        ],

        data: [
            {sparkpoints: ['4.LA.M.B','5.ZA.U.B'], url: 'http://link.com', title: 'What is this?', type: 'Digital', grade: 11, assign: false, vendor: 'Brainpop', issue: true},
            {sparkpoints: ['4.LA.M.B','5.ZA.U.B'], url: 'http://link.com', title: 'Playlist Title', type: 'Teacher Directed', grade: 9, assign: true, vendor: 'Youtube', issue: true},
            {sparkpoints: ['4.LA.M.B','5.ZA.U.B'], url: 'http://link.com', title: 'Playlist Title', type: 'Teacher Directed', grade: 11, assign: false, vendor: 'Brainpop', issue: false},
            {sparkpoints: ['4.LA.M.B','5.ZA.U.B'], url: 'http://link.com', title: 'Playlist Title', type: 'Digital', grade: 9, assign: true, vendor: 'Youtube', issue: false},
            {sparkpoints: ['4.LA.M.B'], url: 'http://link.com', title: 'What is that?', type: 'Digital', grade: 11, assign: false, vendor: 'Brainpop', issue: false},
            {sparkpoints: ['4.LA.M.B','5.ZA.U.B'], url: 'http://link.com', title: 'Playlist Title', type: 'Teacher Directed', grade: 9, assign: true, vendor: 'PBS', issue: true},
            {sparkpoints: ['4.LA.M.B','5.ZA.U.B'], url: 'http://link.com', title: 'Playlist Title', type: 'Digital', grade: 11, assign: false, vendor: 'Brainpop', issue: false},
            {sparkpoints: ['5.ZA.U.B'], url: 'http://link.com', title: 'Playlist Title', type: 'Paper Quiz', grade: 9, assign: true, vendor: 'Illuminate', issue: true},
            {sparkpoints: ['4.LA.M.B','5.ZA.U.B'], url: 'http://link.com', title: 'Playlist Title', type: 'Digital', grade: 11, assign: false, vendor: 'Brainpop', issue: false},
            {sparkpoints: ['4.LA.M.B','5.ZA.U.B'], url: 'http://link.com', title: 'Playlist Title', type: 'Paper Quiz', grade: 9, assign: true, vendor: 'Youtube', issue: false}
        ]
    }
});