/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.work.Assessment', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'integer'
        },
        {
            name: 'class',
            type: 'string'
        },
        {
            name: 'created',
            type: 'date'
        },
        {
            name: 'creatorid',
            type: 'integer'
        },
        {
            name: 'title',
            type: 'string',
        },
        {
            name: 'url',
            type: 'string'
        },
        {
            name: 'vendorid',
            type: 'integer'
        },
        {
            name: 'assessmenttypeid',
            type: 'integer'
        },
        {
            name: 'gradelevel',
            type: 'string'
        },
        {
            name: 'standards'
        },
        {
            name: 'standardids'
        },

        // local-only
        {
            name: 'completed',
            type: 'boolean',
            defaultValue: false
        }
    ]
});