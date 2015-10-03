/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.work.Conference', {
    extend: 'Ext.app.Controller',

    stores: [
        'work.ConferenceQuestions@SparkClassroom.store',
        'work.ConferenceResources@SparkClassroom.store'
    ],

    refs: {
        conferenceCt: 'spark-student-work-conference',
        questionsList: 'spark-worklist#questions',
        resourcesList: 'spark-worklist#resources'
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

    onConferenceCtActivate: function() {
        var store = Ext.getStore('work.ConferenceQuestions');

        if(!store.isLoaded()) {
            store.load();
        }
    },

    onConferenceQuestionsStoreLoad: function(store) {
        var me = this,
            resourcesStore = Ext.getStore('work.ConferenceResources');

        resourcesStore.loadData(store.getProxy().getReader().rawData.resources);

        me.setQuestions(store.getRange());
        me.setResources(resourcesStore.getRange());

    },

    setQuestions: function(recs) {
        var list = this.getQuestionsList(),
            count = recs.length,
            items = [],
            i = 0,
            data;

        for (i; i < count; i++) {
            items.push({
                text: recs[i].get('question')
            });
        }

        data = {
            title: 'Guiding Questions',
            items: items
        };

        list.setData(data);
    },

    setResources: function(recs) {
        var list = this.getResourcesList(),
            count = recs.length,
            items = [],
            i = 0,
            data;

        for (i; i < count; i++) {
            items.push({
                text: recs[i].get('title'),
                linkTitle: recs[i].get('url'),
                linkUrl: recs[i].get('url')
            });
        }

        data = {
            title: 'Resources',
            items: items
        };

        list.setData(data);
    }

});
