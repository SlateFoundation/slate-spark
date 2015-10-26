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
            name: 'restated',
            allowNull: true
        },
        {
            name: 'steps',
            allowNull: true
        },
        {
            name: 'example_1',
            allowNull: true
        },
        {
            name: 'example_2',
            allowNull: true
        },
        {
            name: 'example_3',
            allowNull: true
        },
        {
            name: 'peer_id',
            type: 'int',
            allowNull: true
        },
        {
            name: 'peer_feedback',
            allowNull: true
        },
    ],

    proxy: {
        type: 'slate-api',
        url: '/spark/api/work/conferences/worksheet',

        writer: {
            type: 'json',
            allowSingle: true
        }
    }
});