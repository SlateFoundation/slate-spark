/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.proxy.API', {
    extend: 'Jarvus.proxy.API',
    alias: 'proxy.spark-api',
    requires: [
        'SparkRepositoryManager.API'
    ],

    connection: 'SparkRepositoryManager.API'
});