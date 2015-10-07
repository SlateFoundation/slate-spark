/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.assign.Questions', {
    extend: 'Ext.data.Store',


    config: {
        fields: [
            'sparkpoints',
            'question',
            'grade',
            'created',
            'created_by',
            'assign'
        ],

        data: [
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], question: 'What is this?', created: '5/16/31', created_by: 'Milton Jossund', grade: 11, assign: false},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], question: 'Playlist Title', created: '5/16/31', created_by: 'Milton Jossund', grade: 9, assign: true},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], question: 'Playlist Title', created: '5/16/31', created_by: 'Milton Jossund', grade: 11, assign: false},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], question: 'Playlist Title', created: '5/16/31', created_by: 'Milton Jossund', grade: 9, assign: true},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], question: 'What is that?', created: '5/16/31', created_by: 'Milton Jossund', grade: 11, assign: false},
            {sparkpoints: ['3.LA.M.B'], question: 'Playlist Title', created: '5/16/31', created_by: 'Milton Jossund', grade: 9, assign: true},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], question: 'Playlist Title', created: '5/16/31', created_by: 'Milton Jossund', grade: 11, assign: false},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], question: 'Playlist Title', created: '5/16/31', created_by: 'Milton Jossund', grade: 9, assign: true},
            {sparkpoints: ['5.LA.M.B'], question: 'Playlist Title', created: '5/16/31', created_by: 'Milton Jossund', grade: 11, assign: false},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], question: 'Playlist Title', created: '5/16/31', created_by: 'Milton Jossund', grade: 9, assign: true}
        ]
    }
});