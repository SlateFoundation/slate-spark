/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.work.MasteryCheckScores', {
    extend: 'Ext.data.Store',
    requires: [
        'SparkClassroom.model.work.MasteryCheckScore'
    ],


    config: {
        model: 'SparkClassroom.model.work.MasteryCheckScore',
        autoSync: true
    }
});