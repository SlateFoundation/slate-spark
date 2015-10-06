/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomStudent.store.HelpRequests', {
    extend: 'Ext.data.Store',


    model: 'SparkClassroomStudent.model.HelpRequest',

    config: {
        data: [
            {
                Student: {
                    FirstName: 'Sherrill',
                    LastName: 'Scherf'
                },
                Created: new Date(Date.now() - 5 * 1000),
                Type: 'question-general'
            },
            {
                Student: {
                    FirstName: 'Clarisa',
                    LastName: 'Cross'
                },
                Created: new Date(Date.now() - 50 * 1000),
                Type: 'bathroom'
            },
            {
                Student: {
                    FirstName: 'Shon',
                    LastName: 'Simoneaux'
                },
                Created: new Date(Date.now() - 150 * 1000),
                Type: 'locker'
            },
            {
                Student: {
                    FirstName: 'Edmund',
                    LastName: 'Ebel'
                },
                Created: new Date(Date.now() - 65 * 1000),
                Type: 'nurse'
            },
            {
                Student: {
                    FirstName: 'Jenise',
                    LastName: 'Jiang'
                },
                Created: new Date(Date.now() - 10 * 1000),
                Type: 'question-academic'
            },
            {
                Student: {
                    FirstName: 'Tiffany',
                    LastName: 'To'
                },
                Created: new Date(Date.now() - 300 * 1000),
                Type: 'question-technology'
            }
        ]
    }
});