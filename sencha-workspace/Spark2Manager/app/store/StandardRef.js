Ext.define('Spark2Manager.store.StandardRef', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.StandardRef'
    ],

    model: 'Spark2Manager.model.StandardRef',

    autoSync: true
});
