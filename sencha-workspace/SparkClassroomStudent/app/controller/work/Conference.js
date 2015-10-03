/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.work.Conference', {
    extend: 'Ext.app.Controller',

    stores: [
        'work.ConferenceQuestions',
        'work.ConferenceResources'
    ],

    refs: {
        conferenceCt: 'spark-student-work-conference'
    },

    control: {
        conferenceCt: {
            activate: 'onConferenceCtActivate'
        }
    },

    listen: {
        store: {
            '#work.ConferenceQuestions': {
                load: 'onConferenceQuestionsStoreLoad'
            }
        }
    },

    onConferenceCtActivate: function(conferenceCt) {
        console.log('onConferenceCtActivate');
        var me = this,
            store = me.getWorkConferenceQuestionsStore();

        if(!store.isLoaded()) {
            store.load();
        }
    },

    // TODO: handle loading data into conference section
    onConferenceQuestionsStoreLoad: function(store, records) {
        console.log('onConferenceQuestionsStoreLoad');
        var resourcesStore = Ext.getStore('work.ConferenceResources'),
            recordsLength = records.length,
            i = 0;

        for (i; i < recordsLength; i++) {
            //console.log('hi');
        }

    }

});
