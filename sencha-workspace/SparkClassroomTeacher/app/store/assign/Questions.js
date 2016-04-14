/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.assign.Questions', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.proxy.API'
    ],


    model: 'SparkClassroom.model.work.ConferenceQuestion',

    config: {
        autoSync: true,
        trackRemoved: false,

        proxy: {
            type: 'slate-api',
            url: '/spark/api/assign/guiding_questions',
            reader: {
                type: 'json',
                keepRawData: true,
                messageProperty: 'error',
                rootProperty: 'guiding_questions'
            }
        }
    }
});