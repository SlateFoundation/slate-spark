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
        },

    },

    listen: {
        store: {
            '#work.ConferenceQuestions': {
                load: 'onConferenceQuestionsStoreLoad'
            }
        }
    },


    // event handlers
    onConferenceCtActivate: function() {
        var store = Ext.getStore('work.ConferenceQuestions');

        if(!store.isLoaded()) {
            store.load();
        }
    },

    onConferenceQuestionsStoreLoad: function(questionsStore) {
        var me = this;

        Ext.getStore('work.ConferenceResources').loadData(questionsStore.getProxy().getReader().rawData.resources);

        me.refreshQuestions();
        me.refreshResources();
    },


    // controller methods
    refreshQuestions: function() {
        var questions = Ext.getStore('work.ConferenceQuestions').getRange(),
            count = questions.length,
            items = [],
            i = 0;

        for (i; i < count; i++) {
            items.push({
                text: questions[i].get('question')
            });
        }

        items.push({
            text: '<div class="inline-flex-fullwidth-ct"><input placeholder="Add a guiding question you want to discuss with the teacher (optional)" class="flex-1"> <button type="submit">Add</button></div>',
            skipHtmlEncode: true
        });

        this.getQuestionsList().setData({
            title: 'Guiding Questions',
            items: items
        });
    },

    refreshResources: function() {
        var resources = Ext.getStore('work.ConferenceResources').getRange(),
            count = resources.length,
            items = [],
            i = 0;

        for (i; i < count; i++) {
            items.push({
                text: resources[i].get('title'),
                linkTitle: resources[i].get('url'),
                linkUrl: resources[i].get('url')
            });
        }

        this.getResourcesList().setData({
            title: 'Resources',
            items: items
        });
    }
});