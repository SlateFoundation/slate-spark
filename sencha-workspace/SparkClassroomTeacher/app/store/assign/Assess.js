/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.assign.Assess', {
    extend: 'Ext.data.Store',
    config: {
        fields: ['Standards','Link', 'Title', 'Grade', 'Type', 'Assign', 'Vendor', 'Issue'],

        data: [
            {Standards: ['4.LA.M.B','5.ZA.U.B'], Link: 'http://link.com', Title: 'What is this?', Type: 'Digital', Grade: 11, Assign: false, Vendor: 'Brainpop', Issue: true},
            {Standards: ['4.LA.M.B','5.ZA.U.B'], Link: 'http://link.com', Title: 'Playlist Title', Type: 'Teacher Directed', Grade: 9, Assign: true, Vendor: 'Youtube', Issue: true},
            {Standards: ['4.LA.M.B','5.ZA.U.B'], Link: 'http://link.com', Title: 'Playlist Title', Type: 'Teacher Directed', Grade: 11, Assign: false, Vendor: 'Brainpop', Issue: false},
            {Standards: ['4.LA.M.B','5.ZA.U.B'], Link: 'http://link.com', Title: 'Playlist Title', Type: 'Digital', Grade: 9, Assign: true, Vendor: 'Youtube', Issue: false},
            {Standards: ['4.LA.M.B'], Link: 'http://link.com', Title: 'What is that?', Type: 'Digital', Grade: 11, Assign: false, Vendor: 'Brainpop', Issue: false},
            {Standards: ['4.LA.M.B','5.ZA.U.B'], Link: 'http://link.com', Title: 'Playlist Title', Type: 'Teacher Directed', Grade: 9, Assign: true, Vendor: 'PBS', Issue: true},
            {Standards: ['4.LA.M.B','5.ZA.U.B'], Link: 'http://link.com', Title: 'Playlist Title', Type: 'Digital', Grade: 11, Assign: false, Vendor: 'Brainpop', Issue: false},
            {Standards: ['5.ZA.U.B'], Link: 'http://link.com', Title: 'Playlist Title', Type: 'Paper Quiz', Grade: 9, Assign: true, Vendor: 'Illuminate', Issue: true},
            {Standards: ['4.LA.M.B','5.ZA.U.B'], Link: 'http://link.com', Title: 'Playlist Title', Type: 'Digital', Grade: 11, Assign: false, Vendor: 'Brainpop', Issue: false},
            {Standards: ['4.LA.M.B','5.ZA.U.B'], Link: 'http://link.com', Title: 'Playlist Title', Type: 'Paper Quiz', Grade: 9, Assign: true, Vendor: 'Youtube', Issue: false}
        ]
    }
});