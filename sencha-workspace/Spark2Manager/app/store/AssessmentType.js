Ext.define('Spark2Manager.store.AssessmentType', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.AssessmentType'
    ],

    model: 'Spark2Manager.model.AssessmentType',

    autoSync: true
});
