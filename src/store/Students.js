/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.Students', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.proxy.Records'
    ],


    model: 'Slate.model.person.Person',

    config: {
        proxy: {
            type: 'slate-records'
        }
    }
});