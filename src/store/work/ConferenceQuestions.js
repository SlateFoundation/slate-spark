/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.work.ConferenceQuestions', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.proxy.API'
    ],

    model: 'SparkClassroom.model.work.ConferenceQuestion'

});
