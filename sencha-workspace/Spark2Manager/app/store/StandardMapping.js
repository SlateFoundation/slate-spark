Ext.define('Spark2Manager.store.StandardMapping', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.StandardMapping'
    ],

    model: 'Spark2Manager.model.StandardMapping',

    autoSync: true
});
