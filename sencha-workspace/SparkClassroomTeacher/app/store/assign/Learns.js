/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.assign.Learns', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.proxy.API'
    ],


    model: 'SparkClassroom.model.work.Learn',

    config: {
        autoSync: true,
        trackRemoved: false,

        proxy: {
            type: 'slate-api',
            url: '/spark/api/assign/learns'
        }
    }
});