/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomStudent.model.ConferenceWorksheet', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.proxy.API'
    ],


    idProperty: 'sparkpoint',
    fields: [
        {
            name: 'sparkpoint'
        },
        {
            name: 'student_id',
            type: 'int',
            allowNull: true,
            persist: false
        },

        {
            name: 'restated',
            type: 'string'
        },
        {
            name: 'steps',
            type: 'string'
        },
        {
            name: 'example_1',
            type: 'string'
        },
        {
            name: 'example_2',
            type: 'string'
        },
        {
            name: 'example_3',
            type: 'string'
        },
        {
            name: 'peer_id',
            type: 'int',
            allowNull: true
        },
        {
            name: 'peer_feedback',
            type: 'string'
        },
    ],

    proxy: {
        type: 'slate-api',
        url: '/spark/api/work/conferences/worksheet',

        writer: {
            type: 'json',
            allowSingle: true,
            writeAllFields: true
        }
    }
});