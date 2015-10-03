/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.model.gps.ActiveStudent', {
    extend: 'Ext.data.Model',

    idProperty: 'user_id',
    fields: [
        {
            name: 'user_id',
            type: 'integer'
        },
        {
            name: 'sparkpoint_id',
            type: 'string'
        },
        {
            name: 'sparkpoint_code',
            type: 'string'
        },
        {
            name: 'section_id',
            type: 'string'
        },
        {
            name: 'learn_duration',
            type: 'integer'
        },
        {
            name: 'conference_duration',
            type: 'integer'
        },
        {
            name: 'apply_duration',
            type: 'integer'
        },
        {
            name: 'assess_duration',
            type: 'integer'
        },
        {
            name: 'phase',
            type: 'string'
        },
        {
            name: 'complete',
            type: 'boolean'
        },
        {
            name: 'last_active',
            type: 'date'
        },
        {
            name: 'metatdata'
        },

        {
            name: 'student',
            mapping: 'user_id',
            convert: function(v, r) {
                return Ext.getStore('Students').getById(v);
            }
        }
    ]
});