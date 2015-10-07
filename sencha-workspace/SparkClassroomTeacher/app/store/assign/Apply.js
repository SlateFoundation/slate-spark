/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.assign.Apply', {
    extend: 'Ext.data.Store',


    config: {
        fields: [
            'sparkpoints',
            'title',
            'grade',
            'Assign',
            'CreatedBy',
            'dok'
        ],

        data: [
            {sparkpoints: ['4.LA.M.B','5.ZA.U.B'], title: 'What is this?', dok: 3, CreatedBy: 'Milton Jossund', grade: 11, Assign: false},
            {sparkpoints: ['4.LA.M.B','5.ZA.U.B'], title: 'Playlist Title', dok: 2, CreatedBy: 'Milton Jossund', grade: 9, Assign: true},
            {Standard: ['4.LA.M.B','5.ZA.U.B'], title: 'Playlist Title', dok: 3, CreatedBy: 'Milton Jossund', grade: 11, Assign: false},
            {sparkpoints: ['5.ZA.U.B'], title: 'Playlist Title', dok: 1, CreatedBy: 'Milton Jossund', grade: 9, Assign: true},
            {sparkpoints: ['5.ZA.U.B'], title: 'What is that?', dok: 3, CreatedBy: 'Milton Jossund', grade: 11, Assign: false},
            {sparkpoints: ['4.LA.M.B','5.ZA.U.B'], title: 'Playlist Title', dok: 3, CreatedBy: 'Milton Jossund', grade: 9, Assign: true},
            {sparkpoints: ['4.LA.M.B'], title: 'Playlist Title', dok: 3, CreatedBy: 'Milton Jossund', grade: 11, Assign: false},
            {sparkpoints: ['4.LA.M.B','5.ZA.U.B'], title: 'Playlist Title', dok: 1, CreatedBy: 'Milton Jossund', grade: 9, Assign: true},
            {sparkpoints: ['4.LA.M.B'], title: 'Playlist Title', dok: 2, CreatedBy: 'Milton Jossund', grade: 11, Assign: false},
            {sparkpoints: ['4.LA.M.B','5.ZA.U.B'], title: 'Playlist Title', dok: 1, CreatedBy: 'Milton Jossund', grade: 9, Assign: true}
        ]
    }
});