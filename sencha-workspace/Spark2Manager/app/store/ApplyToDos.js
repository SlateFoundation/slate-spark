/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.store.ApplyToDos', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.ApplyToDo'
    ],

    model: 'Spark2Manager.model.ApplyToDo',

    autoSync: true
});
