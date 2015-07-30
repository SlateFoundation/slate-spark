/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.model.sparkpoint.Sparkpoint', {
    extend: 'Ext.data.Model',

    tooltipTpl: [
        '<p>The full description of <em>{Code}</em> can be displayed here <strong>with arbitrary markup</strong></p>',
        '<tpl if="Description">',
            '<p>{Description}</p>',
        '</tpl>'
    ],

    // model config
    idProperty: 'code',
    fields: [
        // sparkpoint fields
        {
            name: 'ID',
            type: 'int'
        },
        {
            name: 'code',
            type: 'string'
        },
        {
            name: 'title',
            type: 'string'
        }

        // tree meta-fields
    ]
});
