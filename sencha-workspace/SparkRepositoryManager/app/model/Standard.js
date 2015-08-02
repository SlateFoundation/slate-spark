/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.model.Standard', {
    extend: 'Jarvus.model.Postgrest',


    tableUrl: '/standards',

    tooltipTpl: [
        '<p>The full description of <em>{Code}</em> can be displayed here <strong>with arbitrary markup</strong></p>',
        '<tpl if="Description">',
            '<p>{Description}</p>',
        '</tpl>'
    ],

    fields: [{
        name: 'alt_code',
        convert: function(v, r) {
            return v || r.get('code');
        }
    }]
});
