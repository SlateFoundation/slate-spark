/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.work.Feedback', {
    extend: 'Ext.data.Store',
    requires: [
        'SparkClassroom.model.work.Feedback'
    ],


    config: {
        model: 'SparkClassroom.model.work.Feedback',
        autoSync: true
    }
});