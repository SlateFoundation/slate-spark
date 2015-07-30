/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.model.Sparkpoint', {
    extend: 'Jarvus.model.Postgrest',


    tableUrl: '/mock-sparkpoints',

    tooltipTpl: [
        '<p>The full description of <em>{Code}</em> can be displayed here <strong>with arbitrary markup</strong></p>',
        '<tpl if="Description">',
            '<p>{Description}</p>',
        '</tpl>'
    ]
});