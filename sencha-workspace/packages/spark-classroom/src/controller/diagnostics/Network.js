Ext.define('SparkClassroom.controller.diagnostics.Network', {
    extend: 'Ext.app.Controller',
    requires: [
        'Jarvus.util.APIDomain',
        'Ext.Toast'
    ],

    listen: {
        api: {
            requestexception: 'onRequestException'
        }
    },

    onRequestException: function(connection, response, options) {
        if (location.search.match('breakOnNetwork')) {
            debugger;
        }
    }
});