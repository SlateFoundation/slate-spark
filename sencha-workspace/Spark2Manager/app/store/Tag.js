Ext.define('Spark2Manager.store.Tag', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.Tag'
    ],

    model: 'Spark2Manager.model.Tag',

    autoSync: true
});
