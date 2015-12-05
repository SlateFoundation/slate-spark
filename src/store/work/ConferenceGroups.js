/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.work.ConferenceGroups', {
    extend: 'Ext.data.Store',


    model: 'SparkClassroom.model.work.ConferenceGroup',

    config: {
        autoSync: true,
        trackRemoved: false
    }
});