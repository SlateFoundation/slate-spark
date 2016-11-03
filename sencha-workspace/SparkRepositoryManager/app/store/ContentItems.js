Ext.define('SparkRepositoryManager.store.ContentItems', {
    extend: 'Ext.data.Store',

    requires: [
        'SparkRepositoryManager.model.ContentItem'
    ],

    model: 'SparkRepositoryManager.model.ContentItem',

    listeners: {
        'beforeload': function(store) {
            console.log('beforeload');
            console.log(store.getModel().getProxy().getConnection());
//            store.getModel().getProxy().getConnection().setHost('sandbox-school.matchbooklearning.com');
        }
    }

});
