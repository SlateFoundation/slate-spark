/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.model.Jurisdiction', {
    extend: 'Ext.data.Model',

    // model config
    idProperty: 'id',

    fields: [
        {
            name: "id",
            type: "string"
        },

        {
            name: "title",
            type: "string"
        }
    ],

    proxy: {
        type:    'rest',
        url:     'http://commonstandardsproject.com/api/v1/jurisdictions',

        headers: {
            'Api-Key': '<<< HERE CHRIS >>>>'
        },

        reader: {
            type: 'json',
            root: 'data'
        },

        noCache: false
    }
});


