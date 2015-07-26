/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.model.Sparkpoint', {
    extend: 'Ext.data.Model',


    tooltipTpl: [
        '<p>The full description of <em>{Code}</em> can be displayed here <strong>with arbitrary markup</strong></p>',
        '<tpl if="Description">',
            '<p>{Description}</p>',
        '</tpl>'
    ],

    // model config
    idProperty: 'Code',
    fields: [
        // sparkpoint fields
        {
            name: 'Code',
            type: 'string'
        },
        {
            name: 'Description',
            type: 'string'
        }
        
        // tree meta-fields
    ]
});