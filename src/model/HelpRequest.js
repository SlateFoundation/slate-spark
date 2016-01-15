/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.HelpRequest', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.identifier.Negative',
        'Slate.proxy.API',
        'SparkClassroom.data.field.SparkDate'
    ],

    identifier: 'negative',

    fields: [
        {
            name: 'id',
            type: 'integer',
            persist: false
        },
        {
            name: 'student_id',
            type: 'integer',
            persist: false
        },
        {
            name: 'section_id',
            type: 'integer',
            persist: false
        },
        {
            name: 'request_type',
            type: 'string'
        },
        {
            name: 'open_time',
            type: 'sparkdate',
            persist: false
        },
        {
            name: 'close_time',
            type: 'sparkdate'
        },
        {
            name: 'closed_by',
            type: 'integer',
            persist: false
        },

        // synthetic fields:
        {
            name: 'short_request_type',
            persist: false,
            depends: ['request_type'],
            convert: function (v, r) {
                switch (r.get('request_type')) {
                    case 'question-general':
                        return 'G?';
                    case 'question-academic':
                        return 'A?';
                    case 'question-technology':
                        return 'T?';
                    case 'nurse':
                        return 'N';
                    case 'bathroom':
                        return 'B';
                    case 'locker':
                        return 'L';
                }
            }
        },
        {
            name: 'student',
            persist: false,
            depends: ['student_id'],
            convert: function(v, r) {
                return v && v.isModel ? v : Ext.getStore('Students').getById(r.get('student_id'));
            }
        },
        {
            name: 'student_name',
            persist: false,
            depends: ['student'],
            convert: function(v, r) {
                var student = r.get('student');
                return student ? student.get('FullName') : '[Unenrolled Student]';
            }
        },
    ],

    proxy: {
        type: 'slate-api',
        url: '/spark/api/help',
        writer: {
            type: 'json',
            allowSingle: true
        }
    }
});