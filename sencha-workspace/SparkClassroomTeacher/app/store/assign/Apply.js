/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.assign.Apply', {
    extend: 'Ext.data.Store',


    config: {
        fields: [
            'sparkpoints',
            'title',
            'grade',
            'assign',
            'created_by',
            'dok'
        ],

        data: [
            {sparkpoints: ['4.LA.M.B','5.ZA.U.B'], title: 'What is this?', dok: 3, created_by: 'Milton Jossund', grade: 11, assign: false},
            {sparkpoints: ['4.LA.M.B','5.ZA.U.B'], title: 'Playlist Title', dok: 2, created_by: 'Milton Jossund', grade: 9, assign: true},
            {Standard: ['4.LA.M.B','5.ZA.U.B'], title: 'Playlist Title', dok: 3, created_by: 'Milton Jossund', grade: 11, assign: false},
            {sparkpoints: ['5.ZA.U.B'], title: 'Playlist Title', dok: 1, created_by: 'Milton Jossund', grade: 9, assign: true},
            {sparkpoints: ['5.ZA.U.B'], title: 'What is that?', dok: 3, created_by: 'Milton Jossund', grade: 11, assign: false},
            {sparkpoints: ['4.LA.M.B','5.ZA.U.B'], title: 'Playlist Title', dok: 3, created_by: 'Milton Jossund', grade: 9, assign: true},
            {sparkpoints: ['4.LA.M.B'], title: 'Playlist Title', dok: 3, created_by: 'Milton Jossund', grade: 11, assign: false},
            {sparkpoints: ['4.LA.M.B','5.ZA.U.B'], title: 'Playlist Title', dok: 1, created_by: 'Milton Jossund', grade: 9, assign: true},
            {sparkpoints: ['4.LA.M.B'], title: 'Playlist Title', dok: 2, created_by: 'Milton Jossund', grade: 11, assign: false},
            {sparkpoints: ['4.LA.M.B','5.ZA.U.B'], title: 'Playlist Title', dok: 1, created_by: 'Milton Jossund', grade: 9, assign: true}
        ]
    }
});