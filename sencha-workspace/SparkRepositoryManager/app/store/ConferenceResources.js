Ext.define('SparkRepositoryManager.store.ConferenceResources', {
    extend: 'Ext.data.Store',
    requires: [
        'SparkRepositoryManager.model.ConferenceResource'
    ],


    model: 'SparkRepositoryManager.model.ConferenceResource',

    autoSync: true,

    pageSize: 25,

    sorters: [
        {
            property: 'Created',
            direction: 'DESC'
        },
        {
            property: 'Creator',
            direction: 'DESC'
        }
    ],

    remoteSort: true,
    remoteFilter: true
});
