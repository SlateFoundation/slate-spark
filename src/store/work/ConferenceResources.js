/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.work.ConferenceResources', {
    extend: 'Ext.data.Store',
    requires: [
        'SparkClassroom.model.work.ConferenceResource'
    ],

    model: 'SparkClassroom.model.work.ConferenceResource'

});
