/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
/**
 * TODO:
 * - Embed a store in each list that it internally binds to
 * - Move add question form processing details into a questions subclass of the list class
 */
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
        'spark-work-conference spark-worklist#questions': {
            submit: 'onQuestionSubmit'
        }
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

    onQuestionSubmit: function(questionsList) {
        Ext.getStore('work.ConferenceQuestions').add({
            question: questionsList.getInnerHtmlElement().down('input').getValue(),
            studentSubmitted: true
        });

        this.refreshQuestions();
    },


    // controller methods
    refreshQuestions: function() {
        var questions = Ext.getStore('work.ConferenceQuestions').getRange(),
            count = questions.length, i = 0, question,
            items = [];

        for (; i < count; i++) {
            question = questions[i];

            items.push({
                text: question.get('question'),
                studentSubmitted: question.get('studentSubmitted')
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
            count = resources.length, i = 0, resource,
            items = [];

        for (; i < count; i++) {
            resource = resources[i];

            items.push({
                text: resource.get('title'),
                linkTitle: resource.get('url'),
                linkUrl: resource.get('url')
            });
        }

        this.getResourcesList().setData({
            title: 'Resources',
            items: items
        });
    }
});