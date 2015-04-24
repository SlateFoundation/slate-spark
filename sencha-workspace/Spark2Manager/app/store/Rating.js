Ext.define('Spark2Manager.store.Rating', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.Rating'
    ],

    model: 'Spark2Manager.model.Rating',

    autoSync: true
});
