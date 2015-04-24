Ext.define('Spark2Manager.store.GradeLevel', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.GradeLevel'
    ],

    model: 'Spark2Manager.model.GradeLevel',

    autoSync: true
});
