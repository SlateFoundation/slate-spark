/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.Tasks', {
    extend: 'Ext.data.Store',


    model: 'SparkClassroom.model.Task',

    config: {
        autoSync: true,
        sorters: 'id'
    }
});