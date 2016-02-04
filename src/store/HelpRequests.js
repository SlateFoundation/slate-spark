/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.HelpRequests', {
    extend: 'Ext.data.Store',


    model: 'SparkClassroom.model.HelpRequest',

    filters: [
        function(item) {
            return item.close_time == null;
        }
    ],

    config: {
        autoSync: true
    }
});