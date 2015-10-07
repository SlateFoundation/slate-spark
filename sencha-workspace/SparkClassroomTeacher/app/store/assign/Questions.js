/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.assign.Questions', {
    extend: 'Ext.data.Store',


    config: {
        fields: [
            'sparkpoints',
            'Question',
            'grade',
            'Created',
            'CreatedBy',
            'Assign'
        ],

        data: [
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], Question: 'What is this?', Created: '5/16/31', CreatedBy: 'Milton Jossund', grade: 11, Assign: false},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], Question: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', grade: 9, Assign: true},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], Question: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', grade: 11, Assign: false},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], Question: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', grade: 9, Assign: true},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], Question: 'What is that?', Created: '5/16/31', CreatedBy: 'Milton Jossund', grade: 11, Assign: false},
            {sparkpoints: ['3.LA.M.B'], Question: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', grade: 9, Assign: true},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], Question: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', grade: 11, Assign: false},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], Question: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', grade: 9, Assign: true},
            {sparkpoints: ['5.LA.M.B'], Question: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', grade: 11, Assign: false},
            {sparkpoints: ['5.LA.M.B','3.LA.M.B'], Question: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', grade: 9, Assign: true}
        ]
    }
});