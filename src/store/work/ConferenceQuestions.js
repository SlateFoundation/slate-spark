/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.work.ConferenceQuestions', {
    extend: 'Ext.data.Store',
    requires: [
        'SparkClassroom.model.work.ConferenceQuestion'
    ],

    model: 'SparkClassroom.model.work.ConferenceQuestion'

});
