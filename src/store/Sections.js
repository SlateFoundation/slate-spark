/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.Sections', {
    extend: 'Ext.data.Store',
    requires: [
    	'Slate.proxy.Records'
    ],


    config: {
        proxy: {
            type: 'slate-records',
            url: '/sections'
        }
    }
});