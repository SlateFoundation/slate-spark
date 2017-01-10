Ext.define('SparkRepositoryManager.store.ApplyToDos', {
    extend: 'Ext.data.Store',
    requires: [
        'SparkRepositoryManager.model.ApplyToDo'
    ],


    model: 'SparkRepositoryManager.model.ApplyToDo',

    autoSync: true
});
