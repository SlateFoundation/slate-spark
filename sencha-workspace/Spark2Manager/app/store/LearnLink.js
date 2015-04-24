Ext.define('Spark2Manager.store.LearnLink', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.LearnLink'
    ],

    model: 'Spark2Manager.model.LearnLink',

    autoSync: true
});
