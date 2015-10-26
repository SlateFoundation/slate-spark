/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.Todo', {
    extend: 'Ext.data.Model',

    fields: [
        'id',
        'todo',
        {
            name: 'date_due',
            type: 'date',
            allowNull: true,
            convert: function(v, r) {
                return v || new Date();
            }
        },
        {
            name: 'complete',
            type: 'boolean',
            defaultValue: false
        }
    ],

    proxy: {
        type: 'slate-api',
        url: '/spark/api/todos'
    }
});
