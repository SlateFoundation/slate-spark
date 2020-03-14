/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.Sections', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.model.CourseSection',
    	'Slate.proxy.Records'
    ],


    config: {
        model: 'Slate.model.CourseSection',

        proxy: {
            type: 'slate-records',
            url: '/sections',
            limitParam: false,
            startParam: false,
            extraParams: {
                enrolled_user: 'current'
            }
        }
    }
});