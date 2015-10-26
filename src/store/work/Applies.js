/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.work.Applies', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.proxy.API'
    ],

    model: 'SparkClassroom.model.work.Apply'
});
