/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.Sections', {
    extend: 'Ext.data.Store',
    requires: [
    	'Slate.proxy.Records'
    ],

    proxy: {
        type: 'slate-records',
        url: '/sections'
    }
});