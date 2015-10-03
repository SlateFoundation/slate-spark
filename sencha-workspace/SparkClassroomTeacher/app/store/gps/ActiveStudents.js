/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.gps.ActiveStudents', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.proxy.API'
    ],


    model: 'SparkClassroomTeacher.model.gps.ActiveStudent',

    config: {
        proxy: {
            type: 'slate-api',
            url: '/spark/api/work/activity'
        }
    }
});