/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.assign.Resources', {
    extend: 'Ext.data.Store',


    config: {
        fields: [
            'sparkpoints',
            'title',
            'url',
            'grade',
            'created',
            'created_by',
            'assign'
        ],

        data: [
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], url: 'http://link.com', title: 'What is this?', created: '5/16/31', created_by: 'Milton Jossund', grade: 11, assign: false},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], url: 'http://link.com', title: 'Playlist Title', created: '5/16/31', created_by: 'Milton Jossund', grade: 9, assign: true},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], url: 'http://link.com', title: 'Playlist Title', created: '5/16/31', created_by: 'Milton Jossund', grade: 11, assign: false},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], url: 'http://link.com', title: 'Playlist Title', created: '5/16/31', created_by: 'Milton Jossund', grade: 9, assign: true},
            {sparkpoints: ['5.LA.M.B'], url: 'http://link.com', title: 'What is that?', created: '5/16/31', created_by: 'Milton Jossund', grade: 11, assign: false},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], url: 'http://link.com', title: 'Playlist Title', created: '5/16/31', created_by: 'Milton Jossund', grade: 9, assign: true},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], url: 'http://link.com', title: 'Playlist Title', created: '5/16/31', created_by: 'Milton Jossund', grade: 11, assign: false},
            {sparkpoints: ['3.LA.M.B'], url: 'http://link.com', title: 'Playlist Title', created: '5/16/31', created_by: 'Milton Jossund', grade: 9, assign: true},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], url: 'http://link.com', title: 'Playlist Title', created: '5/16/31', created_by: 'Milton Jossund', grade: 11, assign: false},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], url: 'http://link.com', title: 'Playlist Title', created: '5/16/31', created_by: 'Milton Jossund', grade: 9, assign: true}
        ]
    }
});