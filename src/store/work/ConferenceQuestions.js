/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.work.ConferenceQuestions', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.proxy.API'
    ],

    model: 'SparkClassroom.model.work.ConferenceResource',

    config: {
        proxy: {
            type: 'slate-records',
            url: '/spark/api/work/conferences',
            extraParams: {
                sparkpoints: 'MATH.G9-12.BF.4.b'
            }
        }
    }

});
