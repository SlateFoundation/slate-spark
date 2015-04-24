Ext.define('Spark2Manager.store.ApplyLink', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.ApplyLink'
    ],

    model: 'Spark2Manager.model.ApplyLink',

    autoSync: true
});
