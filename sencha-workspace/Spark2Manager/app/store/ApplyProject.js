Ext.define('Spark2Manager.store.ApplyProject', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.ApplyProject'
    ],

    model: 'Spark2Manager.model.ApplyProject',

    autoSync: true
});
