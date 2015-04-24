Ext.define('Spark2Manager.store.ApplyToDo', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.ApplyToDo'
    ],

    model: 'Spark2Manager.model.ApplyToDo',

    autoSync: true
});
