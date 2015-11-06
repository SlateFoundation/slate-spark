/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.work.Applies', {
    extend: 'Ext.data.Store',

    model: 'SparkClassroom.model.work.Apply',

    config: {
        trackRemoved: false
    }
});
