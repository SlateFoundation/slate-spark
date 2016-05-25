/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.Activity', {
    extend: 'Ext.data.Model',

    fields: [
        'sparkpoint_id',
        'sparkpoint',

        'section_id',
        'section_code'
    ],

    proxy: {
        type: 'slate-api',
        url: '/spark/api/work/activity',
        extraParams: {
            status: 'all'
        },
        reader: {
            type: 'json',
            rootProperty: null,
            keepRawData: true
        }
    }
});