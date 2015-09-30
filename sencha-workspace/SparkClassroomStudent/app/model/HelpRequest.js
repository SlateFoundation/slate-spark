/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomStudent.model.HelpRequest', {
    extend: 'Ext.data.Model',
    requires: ['Slate.proxy.Records'],

    fields: [
        'Type',
        'Closed',
        'Student',
        {
            name: 'ID',
            type: 'integer'
        },
        {
            name: 'created',
            type: 'date',
            dateFormate: 'timestamp'
        },
        {
            name: 'SectionID',
            type: 'integer'
        },
        {
            name: 'StudentID',
            type: 'integer'
        },
        {
            name: 'Closed',
            type: 'date',
            dateFormate: 'timestamp'
        },
        {
            name: 'ShortType',
            convert: function (v, r) {
                switch(r.get('Type')) {
                    case 'bathroom':
                        return 'B';
                    case 'question-general':
                        return 'G+';
                    case 'question-academic':
                        return 'A+';
                    case 'question-technology':
                        return 'T+';
                    case 'Nurse':
                        return 'IT';
                }
            }
        },
        {
            name: 'StudentFullName',
            convert: function (v, r) {
                var student = r.get('Student');

                return student ? student.FirstName + ' ' + student.LastName : '';
            }
        }
    ],

    proxy: {
        type: 'slate-records',
        url: '/spark/classroom/help',
        include: [
            'Student'
        ]
    }
});