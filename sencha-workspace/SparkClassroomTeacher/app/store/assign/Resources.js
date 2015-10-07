/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.assign.Resources', {
    extend: 'Ext.data.Store',


    config: {
        fields: [
            'sparkpoints',
            'title',
            'url',
            'grade',
            'Created',
            'CreatedBy',
            'Assign'
        ],

        data: [
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], url: 'http://link.com', title: 'What is this?', Created: '5/16/31', CreatedBy: 'Milton Jossund', grade: 11, Assign: false},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], url: 'http://link.com', title: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', grade: 9, Assign: true},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], url: 'http://link.com', title: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', grade: 11, Assign: false},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], url: 'http://link.com', title: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', grade: 9, Assign: true},
            {sparkpoints: ['5.LA.M.B'], url: 'http://link.com', title: 'What is that?', Created: '5/16/31', CreatedBy: 'Milton Jossund', grade: 11, Assign: false},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], url: 'http://link.com', title: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', grade: 9, Assign: true},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], url: 'http://link.com', title: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', grade: 11, Assign: false},
            {sparkpoints: ['3.LA.M.B'], url: 'http://link.com', title: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', grade: 9, Assign: true},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], url: 'http://link.com', title: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', grade: 11, Assign: false},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], url: 'http://link.com', title: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', grade: 9, Assign: true}
        ]
    }
});