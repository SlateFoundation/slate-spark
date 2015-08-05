/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.model.ContentArea', {
    extend: 'Jarvus.model.Postgrest',
    requires: [
        'SparkRepositoryManager.proxy.ContentAreas'
    ],


    proxy: 'spark-contentareas',
    tableUrl: '/content_areas',
    fields: [
        {
            name: 'title'
        },
        {
            name: 'leaf',
            convert: function(v, r) {
                return !r.get('root');
            }
        },
        {
            name: 'parentId',
            persist: false
        }
    ],

    validators: {
        title: 'presence'
    }
});