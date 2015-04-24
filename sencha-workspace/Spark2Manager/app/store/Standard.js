Ext.define('Spark2Manager.store.Standard', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.Standard'
    ],

    model: 'Spark2Manager.model.Standard',

    autoSync: true
});
