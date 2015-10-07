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
        },

        {
            name: 'priority_group',
            type: 'integer',
            allowNull: true,

            // TODO: remove this when backend is implemented
            convert: function(v, r) {
                var priorityGroups = r.self.priorityGroups = r.self.priorityGroups || {},
                    userId = r.get('user_id');

                // temporarily persist value in model instance until backend is implemented
                if (v === undefined) {
                    v = priorityGroups[userId];
                } else {
                    priorityGroups[userId] = v;
                }

                return v || null;
            }
        },
        {
            name: 'help_request',
            allowNull: true
        }
    ]
});