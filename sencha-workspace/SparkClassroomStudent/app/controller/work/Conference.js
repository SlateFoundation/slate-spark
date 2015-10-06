/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
/**
 * TODO:
 * - Embed a store in each list that it internally binds to
 * - Move add question form processing details into a questions subclass of the list class
 */
Ext.define('SparkClassroomStudent.controller.work.Conference', {
    extend: 'Ext.app.Controller',

    config: {
        activeSparkpoint: null
    },

    stores: [
        'work.ConferenceQuestions@SparkClassroom.store',
        'work.ConferenceResources@SparkClassroom.store'
    ],

    refs: {
        conferenceCt: 'spark-student-work-conference',
        sparkpointCt: 'spark-student-work-conference #sparkpointCt',
        questionsList: 'spark-worklist#questions',
        resourcesList: 'spark-worklist#resources'
    },

    control: {
        conferenceCt: {
            activate: 'onConferenceCtActivate'
        },
        questionsList: {
            submit: 'onQuestionSubmit'
        }
    },

    listen: {
        controller: {
            '#': {
                sparkpointselect: 'onSparkpointSelect'
            }
        },
        store: {
            '#work.ConferenceQuestions': {
                load: 'onConferenceQuestionsStoreLoad'
            },
            '#Students': {
                beforeload: 'onStudentsStoreBeforeLoad'
            }
        }
    },


    // config handlers
    updateActiveSparkpoint: function(sparkpoint) {
        var store = this.getWorkConferenceQuestionsStore();

        // TODO: track dirty state of extraparams?
        store.getProxy().setExtraParam('sparkpoint', sparkpoint);

        // TODO: reload store if sparkpoints param dirty
        if (store.isLoaded()) {
            store.load();
        }
    },

    // event handlers
    onSparkpointSelect: function(sparkpoint) {
        this.setActiveSparkpoint(sparkpoint);
    },

    onConferenceCtActivate: function() {
        var me = this,
            conferenceQuestionsStore = me.getWorkConferenceQuestionsStore(),
            studentsStore = me.getStudentsStore();

        // TODO: get current sparkpoint from a better place when we move to supporting multiple sparkpoints
        me.getSparkpointCt().setTitle(me.getActiveSparkpoint());

        if (!conferenceQuestionsStore.isLoaded()) {
            conferenceQuestionsStore.load();
        }

        if (!studentsStore.isLoaded()) {
            studentsStore.load();
        }
    },

    onConferenceQuestionsStoreLoad: function(questionsStore) {
        var me = this;

        me.getWorkConferenceResourcesStore().loadData(questionsStore.getProxy().getReader().rawData.resources);

        me.refreshQuestions();
        me.refreshResources();
    },

    onQuestionSubmit: function(questionsList) {
        this.getWorkConferenceQuestionsStore().add({
            question: questionsList.getInnerHtmlElement().down('input').getValue(),
            studentSubmitted: true
        });

        this.refreshQuestions();
    },


    // controller methods
    refreshQuestions: function() {
        var me = this,
            questionsStore = me.getWorkConferenceQuestionsStore(),
            count = questionsStore.getCount(), i = 0, question,
            items = [];

        for (; i < count; i++) {
            question = questionsStore.getAt(i);

            items.push({
                text: question.get('question'),
                studentSubmitted: question.get('studentSubmitted')
            });
        }

        items.push({
            text: '<div class="inline-flex-fullwidth-ct"><input placeholder="Add a guiding question you want to discuss with the teacher (optional)" class="flex-1"> <button type="submit">Add</button></div>',
            skipHtmlEncode: true
        });

        me.getQuestionsList().setData({
            title: 'Guiding Questions',
            items: items
        });
    },

    refreshResources: function() {
        var me = this,
            resourcesStore = me.getWorkConferenceResourcesStore(),
            count = resourcesStore.getCount(), i = 0, resource,
            items = [];

        for (; i < count; i++) {
            resource = resourcesStore.getAt(i);

            items.push({
                text: resource.get('title'),
                linkTitle: resource.get('url'),
                linkUrl: resource.get('url')
            });
        }

        me.getResourcesList().setData({
            title: 'Resources',
            items: items
        });
    }


});
