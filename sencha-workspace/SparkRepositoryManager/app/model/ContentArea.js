Ext.define('SparkRepositoryManager.model.ContentArea', {
    extend: 'Ext.data.Model',
    requires: [
        'SparkRepositoryManager.proxy.API',
        'Ext.data.identifier.Negative',
        'Ext.data.validator.Presence'
    ],


    identifier: 'negative',

    proxy: {
        type: 'spark-api',
        url: '/spark-repo/content-areas',
        writer: {
            type: 'api',
            allowSingle: false
        }
    },

    fields: [
        'id',
        { name: 'code', defaultValue: '' },
        // { name: 'teacher_title', defaultValue: '' },
        { name: 'student_title', defaultValue: '' },
        { name: 'sparkpoints_count', defaultValue: 0, persist: false },

        // override tree metafields with custom configs
        {
            name: 'parentId',
            mapping: 'parent_id'
        },
        {
            name: 'leaf',
            persist: false
        },
        {
            name: 'title',
            persist: false
        }
    ],

    validators: {
        student_title: 'presence'
    }
});