/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.model.ContentArea', {
    extend: 'Ext.data.Model',
    requires: [
        'SparkRepositoryManager.proxy.API'
    ],


    proxy: {
        type: 'spark-api',
        url: '/spark-repo/content-areas'
    },

    fields: [
        'id',
        { name: 'code', defaultValue: '' },
        { name: 'teacher_title', defaultValue: '' },
        { name: 'student_title', defaultValue: '' },

        // override tree metafields with custom configs
        {
            name: 'parentId',
            mapping: 'parent_id',
            persist: false
        }
    ],

    validators: {
        title: 'presence'
    }
});