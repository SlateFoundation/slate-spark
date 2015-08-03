/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.assign.Apply', {
    extend: 'Ext.data.Store',
    config: {
        fields: ['Standards', 'Title', 'Grade', 'Assign', 'CreatedBy', 'DOK'],


            data: [
                {Standards: ['4.LA.M.B','5.ZA.U.B'], Title: 'What is this?', DOK: 3, CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
                {Standards: ['4.LA.M.B','5.ZA.U.B'], Title: 'Playlist Title', DOK: 2, CreatedBy: 'Milton Jossund', Grade: 9, Assign: true},
                {Standard: ['4.LA.M.B','5.ZA.U.B'], Title: 'Playlist Title', DOK: 3, CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
                {Standards: ['5.ZA.U.B'], Title: 'Playlist Title', DOK: 1, CreatedBy: 'Milton Jossund', Grade: 9, Assign: true},
                {Standards: ['5.ZA.U.B'], Title: 'What is that?', DOK: 3, CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
                {Standards: ['4.LA.M.B','5.ZA.U.B'], Title: 'Playlist Title', DOK: 3, CreatedBy: 'Milton Jossund', Grade: 9, Assign: true},
                {Standards: ['4.LA.M.B'], Title: 'Playlist Title', DOK: 3, CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
                {Standards: ['4.LA.M.B','5.ZA.U.B'], Title: 'Playlist Title', DOK: 1, CreatedBy: 'Milton Jossund', Grade: 9, Assign: true},
                {Standards: ['4.LA.M.B'], Title: 'Playlist Title', DOK: 2, CreatedBy: 'Milton Jossund', Grade: 11, Assign: false},
                {Standards: ['4.LA.M.B','5.ZA.U.B'], Title: 'Playlist Title', DOK: 1, CreatedBy: 'Milton Jossund', Grade: 9, Assign: true}
            ]
    }
});