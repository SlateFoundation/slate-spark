/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.proxy.Records', {
    extend: 'Emergence.proxy.Records',
    alias: 'proxy.spark-records',
    requires: [
        'SparkRepositoryManager.API'
    ],

    connection: 'SparkRepositoryManager.API'
});