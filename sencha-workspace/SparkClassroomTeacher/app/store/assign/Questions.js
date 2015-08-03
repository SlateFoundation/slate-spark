/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.assign.Questions', {
    extend: 'Ext.data.Store',
    config: {
        fields: ['Standards','Question', 'Grade', 'Created', 'CreatedBy', 'Assign'],


        data: [
            {Standards: ['5.LA.M.B','3.LA.M.B'], Question: 'What is this?', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
            {Standards: ['5.LA.M.B','3.LA.M.B'], Question: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 9, Assign: true},
            {Standards: ['5.LA.M.B','3.LA.M.B'], Question: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
            {Standards: ['5.LA.M.B','3.LA.M.B'], Question: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 9, Assign: true},
            {Standards: ['5.LA.M.B','3.LA.M.B'], Question: 'What is that?', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
            {Standards: ['3.LA.M.B'], Question: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 9, Assign: true},
            {Standards: ['5.LA.M.B','3.LA.M.B'], Question: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
            {Standards: ['5.LA.M.B','3.LA.M.B'], Question: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 9, Assign: true},
            {Standards: ['5.LA.M.B'], Question: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
            {Standards: ['5.LA.M.B','3.LA.M.B'], Question: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 9, Assign: true}
        ]
    }
});