/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.Task', {
    extend: 'Ext.data.Model',

    fields: [
        'id',
        'todo',
        {
            name: 'entry_date',
            type: 'date'
        },
        {
            name: 'due_date',
            type: 'date',
            allowNull: true,
            convert: function(v, r) {
                return v || new Date();
            }
        },
        {
            name: 'completed',
            type: 'boolean',
            defaultValue: false
        }
    ],

    proxy: {
        type: 'slate-api',
        url: '/spark/api/todos'
    }
});
