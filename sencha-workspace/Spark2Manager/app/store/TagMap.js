Ext.define('Spark2Manager.store.TagMap', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.TagMap'
    ],

    model: 'Spark2Manager.model.TagMap',

    autoSync: true
});
