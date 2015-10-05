/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.work.Apply', {
    extend: 'Ext.data.Model',

    fields: [
        'id',
        'title',
        'instructions',
        'dok',
        'sparkpointIds',
        'sparkpointCodes',
        'standardCodes',
        'todos',
        'links',

        // local-only
        {
            name: 'completed',
            type: 'boolean',
            defaultValue: false
        }
    ]
});
