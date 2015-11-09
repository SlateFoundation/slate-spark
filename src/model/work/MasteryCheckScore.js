/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.work.MasteryCheckScore', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.identifier.Negative',
        'Ext.data.validator.Presence',
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
            name: 'teacher_id',
            type: 'int',
            allowNull: true,
            persist: false
        },
        {
            name: 'created_on',
            type: 'sparkdate',
            allowNull: true,
            persist: false
        },

        // client-assigned fields
        {
            name: 'student_id',
            type: 'int',
            critical: true
        },
        {
            name: 'sparkpoint',
            type: 'string',
            critical: true
        },
        {
            name: 'phase',
            type: 'string',
            critical: true
        },
        {
            name: 'score',
            type: 'int'
        },

        // server-side derived data
        {
            name: 'sparkpoint_id',
            type: 'string',
            allowNull: true,
            persist: false
        },
        {
            name: 'teacher_name',
            type: 'string',
            allowNull: true,
            persist: false
        }
    ],

    validators: {
        score: 'presence'
    },

    proxy: {
        type: 'slate-api',
        url: '/spark/api/work/mastery-check-scores'
    }
});