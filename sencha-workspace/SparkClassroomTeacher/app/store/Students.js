/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.Students', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.model.person.Person'
    ],
    
    config: {
        model: 'Slate.model.person.Person',
        data: [
            //Learn Data
            {FirstName: "Milton", LastName: 'Jossund', GPSStatus: 'Learn', Standards: ['CC.Content', 'CC.SS.Math.Content'], Help: true, Priority: 0},
            {FirstName: "John", LastName: 'Angeloff', GPSStatus: 'Learn', Standards: ['CC.Content', 'CC.SS.Math.Content'], Help: true},
            {FirstName: "Delila", LastName: 'Dach', GPSStatus: 'Learn', Standards: ['CC.Content', 'CC.SS.Math.Content']},
            {FirstName: "Billie", LastName: 'Heimbuch', Grade: 'G?', GPSStatus: 'Learn', Standards: ['CC.Content', 'CC.SS.Math.Content']},
            {FirstName: "Kimiko", LastName: 'Sasaki', GPSStatus: 'Learn', Standards: ['CC.Content', 'CC.SS.Math.Content'], Priority: 0},
            
            //Conference Data
            {FirstName: "Reanna", LastName: 'Mask', GPSStatusGroup: 'Waiting', Grade: '*', GPSStatus: 'Conference', Standards: ['CC.Content', 'CC.SS.Math.Content']},
            {FirstName: "Zora", LastName: 'Catherwood', GPSStatusGroup: 'Waiting', Grade: '*', GPSStatus: 'Conference', Standards: ['CC.Content', 'CC.SS.Math.Content'], Help: true},
            {FirstName: "Julene", LastName: 'Sander', GPSStatusGroup: 'In Conference', Grade: 'L', GPSStatus: 'Conference', Standards: ['CC.Content', 'CC.SS.Math.Content'], Help: true},
            {FirstName: "Milton", LastName: 'Vanvorst', GPSStatusGroup: 'In Conference', Grade: 'G', GPSStatus: 'Conference', Standards: ['CC.Content', 'CC.SS.Math.Content'], Help: true},
            {FirstName: "Milton", LastName: 'Jossund', GPSStatusGroup: 'In Conference', GPSStatus: 'Conference', Standards: ['CC.Content', 'CC.SS.Math.Content']},
            
            //Apply Data
            {FirstName: "Milton", LastName: 'Vanvorst', GPSStatusGroup: 'Working', Grade: 'N', GPSStatus: 'Apply', Standards: ['CC.Content', 'CC.SS.Math.Content']},
            {FirstName: "Milton", LastName: 'Catherwood', GPSStatusGroup: 'Working', Grade: 'G', GPSStatus: 'Apply', Standards: ['CC.Content', 'CC.SS.Math.Content'], Priority: 0},
            {FirstName: "Cheree", LastName: 'Masaro', GPSStatusGroup: 'Needs Grading', Grade: '*', GPSStatus: 'Apply', Standards: ['CC.Content', 'CC.SS.Math.Content']},
            {FirstName: "Milton", LastName: 'Heimbuch', GPSStatusGroup: 'Needs Grading', Grade: '*', GPSStatus: 'Apply', Standards: ['CC.Content', 'CC.SS.Math.Content'], Priority: 0},
            {FirstName: "Milton", LastName: 'Jossund', GPSStatusGroup: 'Needs Grading', Grade: '*', GPSStatus: 'Apply', Standards: ['CC.Content', 'CC.SS.Math.Content'], Help: true},
            
            //Assess Data
            {FirstName: "Milton", LastName: 'Jossund', GPSStatusGroup: 'Needs Grading', Grade: '*', GPSStatus: 'Assess', Standards: ['CC.Content', 'CC.SS.Math.Content'], Priority: 0},
            {FirstName: "Milton", LastName: 'Catherwood', GPSStatusGroup: 'Needs Grading', Grade: 'A?', GPSStatus: 'Assess', Standards: ['CC.Content', 'CC.SS.Math.Content']},
            {FirstName: "Brendan", LastName: 'Vanvorst', Grade: '*', GPSStatus: 'Assess', Standards: ['CC.Content', 'CC.SS.Math.Content'], Help: true},
            {FirstName: "Reanna", LastName: 'Jossund', Grade: 'IT', GPSStatus: 'Assess', Standards: ['CC.Content', 'CC.SS.Math.Content'], Priority: 1},
            {FirstName: "Kimiko", LastName: 'Heimbuch', Grade: '*', GPSStatus: 'Assess', Standards: ['CC.Content', 'CC.SS.Math.Content'], Priority: 1}
        ]
    }
});