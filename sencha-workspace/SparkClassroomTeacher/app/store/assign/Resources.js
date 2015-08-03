/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.assign.Resources', {
    extend: 'Ext.data.Store',
    config: {
        fields: ['Standards','Link', 'Title', 'Grade', 'Created', 'CreatedBy', 'Assign'],


        data: [
            {Standards: ['5.LA.M.B','3.LA.M.B'], Link: 'http://link.com', Title: 'What is this?', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
            {Standards: ['5.LA.M.B','3.LA.M.B'], Link: 'http://link.com', Title: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 9, Assign: true},
            {Standards: ['5.LA.M.B','3.LA.M.B'], Link: 'http://link.com', Title: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
            {Standards: ['5.LA.M.B','3.LA.M.B'], Link: 'http://link.com', Title: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 9, Assign: true},
            {Standards: ['5.LA.M.B'], Link: 'http://link.com', Title: 'What is that?', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
            {Standards: ['5.LA.M.B','3.LA.M.B'], Link: 'http://link.com', Title: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 9, Assign: true},
            {Standards: ['5.LA.M.B','3.LA.M.B'], Link: 'http://link.com', Title: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
            {Standards: ['3.LA.M.B'], Link: 'http://link.com', Title: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 9, Assign: true},
            {Standards: ['5.LA.M.B','3.LA.M.B'], Link: 'http://link.com', Title: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
            {Standards: ['5.LA.M.B','3.LA.M.B'], Link: 'http://link.com', Title: 'Playlist Title', Created: '5/16/31', CreatedBy: 'Milton Jossund', Grade: 9, Assign: true}
        ]
    }
});