Ext.define('Spark2Manager.store.Comment', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.Comment'
    ],

    model: 'Spark2Manager.model.Comment',

    autoSync: true
});
