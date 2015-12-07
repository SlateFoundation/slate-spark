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
            allowNull: true
        },

        {
            name: 'timer_time',
            type: 'sparkdate',
            allowNull: true
        },
        {
            name: 'accrued_seconds',
            type: 'int',
            defaultValue: 0
        },

        // local-only fields
        {
            name: 'members',
            persist: false
        }
    ],

    proxy: {
        type: 'slate-api',
        url: '/spark/api/work/conference-groups'
    },

    close: function() {
        var me = this,
            timerTime = me.get('timer_time'),
            now = new Date(),
            changes = {},
            dirty = false;

        if (!me.get('closed_time')) {
            changes.closed_time = now;
            dirty = true;
        }

        if (timerTime) {
            changes.accrued_seconds = me.get('accrued_seconds') + (now - timerTime) / 1000;
            changes.timer_time = null;
            dirty = true;
        }

        if (dirty) {
            me.set(changes);
        }
    }
});