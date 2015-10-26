/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.work.Assessments', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.proxy.API'
    ],

    model: 'SparkClassroom.model.work.Assessment',

    config: {
        proxy: {
            type: 'slate-api',
            url: '/spark/api/work/assess',
            reader: {
                type: 'json',
                keepRawData: true,
                rootProperty: 'assessments',
            }
        }
    }
});