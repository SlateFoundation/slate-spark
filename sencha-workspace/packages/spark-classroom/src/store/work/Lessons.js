/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.work.Lessons', {
    extend: 'Ext.data.Store',
    model: 'SparkClassroom.model.work.Lesson',


    config: {
        autoSync: true,
        trackRemoved: false
    }
});