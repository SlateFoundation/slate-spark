/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
/**
 * TODO:
 * - Embed a store in each list that it internally binds to
 * - Move add question form processing details into a questions subclass of the list class
 */
Ext.define('SparkClassroomTeacher.controller.work.Conference', {
    extend: 'Ext.app.Controller',

    config: {
        activeStudent: null,
        activeSparkpoint: null
    },

    stores: [
        'work.ConferenceQuestions@SparkClassroom.store',
        'work.ConferenceResources@SparkClassroom.store'
    ],

    refs: {
        conferenceCt: 'spark-teacher-work-conference',
        sparkpointCt: 'spark-teacher-work-conference #sparkpointCt',
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
                activestudentselect: 'onActiveStudentSelect'
            }
        },
        store: {
            '#work.ConferenceQuestions': {
                load: 'onConferenceQuestionsStoreLoad'
            }
        }
    },


    // config handlers
    updateActiveStudent: function(activeStudent) {
        this.setActiveSparkpoint(activeStudent.get('sparkpoint_code'))
    },

    updateActiveSparkpoint: function(sparkpoint) {
        var store = this.getWorkConferenceQuestionsStore();

        // TODO: track dirty state of extraparams?
        store.getProxy().setExtraParam('sparkpoint', sparkpoint);

        // TODO: reload store if sparkpoints param dirty
        if (store.isLoaded()) {
            store.load();
        }

        this.syncActiveSparkpoint();
    },

    // event handlers
    onActiveStudentSelect: function(student) {
        this.setActiveStudent(student);
    },

    onConferenceCtActivate: function() {
        this.syncActiveSparkpoint();
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
    syncActiveSparkpoint: function() {
        var me = this,
            conferenceCt = me.getConferenceCt(),
            conferenceQuestionsStore = me.getWorkConferenceQuestionsStore(),
            sparkpoint = me.getActiveSparkpoint();

        if (!conferenceCt) {
            return;
        }

        // TODO: get current sparkpoint from a better place when we move to supporting multiple sparkpoints
        if (sparkpoint) {
            me.getSparkpointCt().setTitle(sparkpoint);
            conferenceCt.show();

            if (!conferenceQuestionsStore.isLoaded()) {
                conferenceQuestionsStore.load();
            }
        } else {
            conferenceCt.hide();
        }
    },

    refreshQuestions: function() {
        var me = this,
            questionsStore = me.getWorkConferenceQuestionsStore(),
            count = questionsStore.getCount(), i = 0, question,
            items = [];

        for (; i < count; i++) {
            question = questionsStore.getAt(i);

            items.push({
                text: question.get('question')
            });
        }

        items.push({
            text: '<div class="inline-flex-fullwidth-ct"><input placeholder="Add a guiding question you want to discuss with the student (optional)" class="flex-1"> <button type="submit">Add</button></div>',
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