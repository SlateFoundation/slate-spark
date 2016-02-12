/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.HelpRequests', {
    extend: 'Ext.data.Store',


    model: 'SparkClassroom.model.HelpRequest',

    filters: [
        function(helpRequest) {
            return helpRequest.get('student') && !helpRequest.get('close_time');
        }
    ],

    config: {
        autoSync: true
    }
});