/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomStudent.store.work.ConferenceQuestions', {
    extend: 'Ext.data.Store',
    requires: [
        'SparkClassroomStudent.model.work.ConferenceQuestion'
    ],

    model: 'ClassroomStudent.model.work.ConferenceQuestion'

});
