/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.proxy.Records', {
    extend: 'Emergence.proxy.Records',
    alias: 'proxy.spark-records',

    connection: 'SparkRepositoryManager.API'
});