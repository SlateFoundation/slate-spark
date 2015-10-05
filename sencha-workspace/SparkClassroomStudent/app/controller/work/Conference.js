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
            i = 0;

        for (i; i < count; i++) {
            items.push({
                text: recs[i].get('question')
            });
        }

        items.push({
            text: '<div class="inline-flex-fullwidth-ct"><input placeholder="Add a guiding question you want to discuss with the teacher (optional)" class="flex-1"> <button type="submit">Add</button></div>',
            skipHtmlEncode: true
        });

        list.setData({
            title: 'Guiding Questions',
            items: items
        });
    },

    setResources: function(recs) {
        var list = this.getResourcesList(),
            count = recs.length,
            items = [],
            i = 0;

        for (i; i < count; i++) {
            items.push({
                text: recs[i].get('title'),
                linkTitle: recs[i].get('url'),
                linkUrl: recs[i].get('url')
            });
        }

        list.setData({
            title: 'Resources',
            items: items
        });
    }

});
