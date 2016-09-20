/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.work.Feedback', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.identifier.Negative',
        'SparkClassroom.data.field.SparkDate'
    ],


    identifier: 'negative',

    fields: [
        // server-assigned fields
        {
            name: 'id',
            type: 'int',
            persist: false
        },
        {
            name: 'author_id',
            type: 'int',
            allowNull: true,
            persist: false
        },
        {
            name: 'created_time',
            type: 'sparkdate',
            allowNull: true,
            persist: false
        },

        // client-assigned fields
        {
            name: 'student_id',
            type: 'int'
        },
        {
            name: 'sparkpoint',
            type: 'string'
        },
        {
            name: 'phase',
            type: 'string'
        },
        {
            name: 'message',
            type: 'string'
        },

        // server-side derived data
        {
            name: 'sparkpoint_id',
            type: 'string',
            allowNull: true,
            persist: false
        },
        {
            name: 'author_name',
            type: 'string',
            allowNull: true,
            persist: false
        }
    ],

    proxy: {
        type: 'slate-api',
        url: '/spark/api/work/feedback'
    }
});
