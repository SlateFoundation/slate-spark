Ext.define('SparkRepositoryManager.store.AssessmentTypes', {
    extend: 'Ext.data.Store',
    requires: [
        'SparkRepositoryManager.model.AssessmentType'
    ],


    model: 'SparkRepositoryManager.model.AssessmentType',

    autoSync: true
});
