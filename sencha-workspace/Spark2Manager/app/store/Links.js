Ext.define('Spark2Manager.store.Links', {
    requires: [
        'Spark2Manager.model.Link'
    ],

    extend: 'Ext.data.Store',

    model: 'Spark2Manager.model.Link',

    autoSync: true
});
