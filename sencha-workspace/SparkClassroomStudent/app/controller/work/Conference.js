/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
/**
 * TODO:
 * - Embed a store in each list that it internally binds to
 * - Move add question form processing details into a questions subclass of the list class
 */
Ext.define('SparkClassroomStudent.controller.work.Conference', {
    extend: 'Ext.app.Controller',

    config: {
        activeSparkpoint: null, // TODO: deprecate
        studentSparkpoint: null
    },

    stores: [
        'work.ConferenceQuestions@SparkClassroom.store',
        'work.ConferenceResources@SparkClassroom.store'
    ],

    models: [
        'ConferenceWorksheet'
    ],

    refs: {
        conferenceCt: 'spark-student-work-conference',
        sparkpointCt: 'spark-student-work-conference #sparkpointCt',
        questionsList: 'spark-worklist#questions',
        resourcesList: 'spark-worklist#resources',
        worksheetForm: 'spark-student-work-conference-worksheet',
        requestBtn: 'spark-student-work-conference #requestConferenceBtn'
    },

    control: {
        conferenceCt: {
            activate: 'onConferenceCtActivate'
        },
        questionsList: {
            submit: 'onQuestionSubmit'
        },
        'spark-student-work-conference-worksheet field': {
            change: 'onWorksheetFieldChange'
        },
        requestBtn: {
            tap: 'onRequestBtnTap'
        }
    },

    listen: {
        controller: {
            '#': {
                sparkpointselect: 'onSparkpointSelect',
                studentsparkpointload: 'onStudentSparkpointLoad'
            }
        },
        store: {
            '#work.ConferenceQuestions': {
                load: 'onConferenceQuestionsStoreLoad'
            }
        },
        socket: {
            data: 'onSocketData'
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

    onStudentSparkpointLoad: function(studentSparkpoint) {
        this.setStudentSparkpoint(studentSparkpoint);
    },

    onConferenceCtActivate: function() {
        var me = this,
            conferenceQuestionsStore = me.getWorkConferenceQuestionsStore();

        // TODO: get current sparkpoint from a better place when we move to supporting multiple sparkpoints
        me.getSparkpointCt().setTitle(me.getActiveSparkpoint());

        if (!conferenceQuestionsStore.isLoaded()) {
            conferenceQuestionsStore.load();
        }
    },

    onConferenceQuestionsStoreLoad: function(questionsStore) {
        var me = this,
            rawData = questionsStore.getProxy().getReader().rawData || {},
            worksheet = me.getConferenceWorksheetModel().create(Ext.apply({
                sparkpoint: me.getActiveSparkpoint()
            }, rawData.worksheet));

        me.getWorkConferenceResourcesStore().loadData(rawData.resources || []);

        me.getWorksheetForm().setRecord(worksheet);

        me.refreshQuestions();
        me.refreshResources();
    },

    onQuestionSubmit: function(questionsList) {
        var me = this,
            studentSparkpoint = me.getStudentSparkpoint();

        Slate.API.request({
            method: 'POST',
            url: '/spark/api/work/conferences/questions',
            jsonData: {
                sparkpoint: studentSparkpoint.get('sparkpoint'),
                source: 'student',
                question: questionsList.getInnerHtmlElement().down('input').getValue()
            },
            success: function(response) {
                me.getWorkConferenceQuestionsStore().loadRawData([response.data], true);
                me.refreshQuestions();
            }
        });
    },

    onWorksheetFieldChange: function(field, value) {
        this.writeWorksheet();
    },

    onRequestBtnTap: function() {
        var studentSparkpoint = this.getStudentSparkpoint();

        if (!studentSparkpoint.get('conference_start_time')) {
            studentSparkpoint.set('conference_start_time', new Date());
            studentSparkpoint.save();
        }
    },

    onSocketData: function(socket, data) {
        var me = this;

        if (data.table != 'conference_questions') {
            return;
        }

        me.getWorkConferenceQuestionsStore().loadRawData([data.item], true);
        me.refreshQuestions();
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
                source: question.get('source')
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
    },

    writeWorksheet: Ext.Function.createBuffered(function() {
        var worksheetForm = this.getWorksheetForm(),
            worksheet = worksheetForm.getRecord();

        worksheetForm.updateRecord(worksheet);

        if (worksheet.dirty) {
            worksheet.save();
        }
    }, 2000)
});