/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.Sections', {
    extend: 'Ext.data.Store',
    singleton: true,
    requires: [
    	'Slate.proxy.API'
    ],

    proxy: {
        type: 'slate-api',
        url: '/sections'
    },

    storeId: 'sectionsStore',
    autoLoad: true
});