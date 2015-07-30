/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.model.ContentArea', {
    extend: 'Jarvus.model.Postgrest',
    requires: [
        'SparkRepositoryManager.proxy.ContentAreas'
    ],


    proxy: 'spark-contentareas',
    tableUrl: '/mock-content_areas',
    idProperty: 'code',
    fields: [
        {
            name: 'leaf',
            convert: function(v, r) {
                return !r.get('root');
            }
        }
    ]
});