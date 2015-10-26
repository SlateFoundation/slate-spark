/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.Todos', {
    extend: 'Ext.data.Store',


    model: 'SparkClassroom.model.Todo',

    config: {
        autoSync: true,
        sorters: 'id'
    }
});