/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.work.ConferenceGroup', {
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
            type: 'integer'
        },
        {
            name: 'section_id',
            type: 'string'
        },

        {
            name: 'opened_time',
            type: 'sparkdate',
            persist: false
        },
        {
            name: 'closed_time',
            type: 'sparkdate',
            allowNull: true,
            dateWriteFormat: 'C' // TODO: remove when default unix timestamp works again
        },

        {
            name: 'timer_time',
            type: 'sparkdate',
            allowNull: true,
            dateWriteFormat: 'C' // TODO: remove when default unix timestamp works again
        },
        {
            name: 'accrued_seconds',
            type: 'int',
            defaultValue: 0
        }
    ],

    proxy: {
        type: 'slate-api',
        url: '/spark/api/work/conference-groups'
    }
});