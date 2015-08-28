/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.Sections', {
    extend: 'Ext.data.Store',
    singleton: true,
    requires: [
    	'SparkClassroom.proxy.API'
    ],
    
    proxy: {
        type: 'spark-api',
        url: '/sections?format=json',
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
    },

    storeId: 'sectionsStore',
    autoLoad: true
});