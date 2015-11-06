/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.Sections', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.model.Section',
    	'Slate.proxy.Records'
    ],


    config: {
        model: 'Slate.model.Section',

        proxy: {
            type: 'slate-records',
            url: '/sections',
            limitParam: false,
            startParam: false
        }
    }
});