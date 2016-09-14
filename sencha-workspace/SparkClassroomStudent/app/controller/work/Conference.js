/**
 * TODO:
 * - Embed a store in each list that it internally binds to
 * - Move add question form processing details into a questions subclass of the list class
 */
Ext.define('SparkClassroomStudent.controller.work.Conference', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.util.DelayedTask'
    ],

    config: {
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
                studentsparkpointload: 'onStudentSparkpointLoad',
                studentsparkpointupdate: 'onStudentSparkpointUpdate'
            }
        },
        store: {
            '#work.ConferenceQuestions': {
                beforeload: 'onConferenceQuestionsStoreBeforeLoad',
                load: 'onConferenceQuestionsStoreLoad'
            }
        },
        socket: {
            data: 'onSocketData'
        }
    },


    // controller template methods
    init: function() {
        var me = this;

        me.writeWorksheetTask = new Ext.util.DelayedTask(me.writeWorksheet, me);
    },


    // config handlers
    updateStudentSparkpoint: function(studentSparkpoint, oldStudentSparkpoint) {
        var me = this,
            store = me.getWorkConferenceQuestionsStore(),
            conferenceCt = me.getConferenceCt(),
            sparkpointCt = me.getSparkpointCt(),
            sparkpointCode = studentSparkpoint && studentSparkpoint.get('sparkpoint');

        // flush any worksheet changes
        me.writeWorksheetTask.cancel();
        me.writeWorksheet();

        if (!studentSparkpoint) {
            return;
        }

        // load/update questions store
        store.getProxy().setExtraParam('sparkpoint', sparkpointCode);
        if (store.isLoaded() || (conferenceCt && conferenceCt.hasParent())) {
            store.load();
        }

        // update title bar
        if (sparkpointCt) {
            sparkpointCt.setTitle(sparkpointCode);
        }

        // update request button text/disabled
        me.refreshRequestBtn();
    },

    // event handlers
    onStudentSparkpointLoad: function(studentSparkpoint) {
        this.setStudentSparkpoint(studentSparkpoint);
    },

    onStudentSparkpointUpdate: function() {
        this.refreshRequestBtn();
    },

    onConferenceCtActivate: function() {
        var me = this,
            conferenceQuestionsStore = me.getWorkConferenceQuestionsStore(),
            studentSparkpoint = me.getStudentSparkpoint();

        me.getSparkpointCt().setTitle(studentSparkpoint ? studentSparkpoint.get('sparkpoint') : 'Loading&hellip;');

        if (studentSparkpoint && !conferenceQuestionsStore.isLoaded()) {
            conferenceQuestionsStore.load();
        }

        me.refreshRequestBtn();
    },

    onConferenceQuestionsStoreBeforeLoad: function() {
        var conferenceCt = this.getConferenceCt();

        if (conferenceCt) {
            conferenceCt.setMasked({xtype: 'loadmask', message: 'Loading Conference&hellip;'});
        }
    },

    onConferenceQuestionsStoreLoad: function(questionsStore) {
        var me = this,
            conferenceCt = me.getConferenceCt(),
            questionsProxy = questionsStore.getProxy(),
            rawData = questionsProxy.getReader().rawData || {},
            worksheet = me.getConferenceWorksheetModel().create(Ext.apply({
                sparkpoint: questionsProxy.getExtraParams().sparkpoint
            }, rawData.worksheet));

        me.getWorkConferenceResourcesStore().loadData(rawData.resources || []);

        me.getWorksheetForm().setRecord(worksheet);

        me.refreshQuestions();
        me.refreshResources();

        conferenceCt.setMasked(false);
    },

    onQuestionSubmit: function() {
        var me = this,
            studentSparkpoint = me.getStudentSparkpoint();

        Slate.API.request({
            method: 'POST',
            url: '/spark/api/work/conferences/questions',
            jsonData: {
                sparkpoint: studentSparkpoint.get('sparkpoint'),
                source: 'student',
                question: me.getQuestionInputEl().getValue()
            },
            success: function(response) {
                me.refreshQuestions();
            }
        });
    },

    onWorksheetFieldChange: function(field, value) {
        this.writeWorksheetTask.delay(1000);
    },

    onRequestBtnTap: function() {
        var studentSparkpoint = this.getStudentSparkpoint();

        if (!studentSparkpoint.get('conference_start_time')) {
            studentSparkpoint.set('conference_start_time', new Date());
            studentSparkpoint.save();
            this.refreshRequestBtn();
        }
    },

    onSocketData: function(socket, data) {
        var me = this,
            itemData = data.item,
            questionsStore,
            studentSparkpoint,
            questionInputEl, questionInputValue, questionInputFocused,
            question, resource;

        if (data.table == 'conference_questions') {
            questionsStore = me.getWorkConferenceQuestionsStore();
            studentSparkpoint = me.getStudentSparkpoint();

            if (
                studentSparkpoint &&
                questionsStore.isLoaded() &&
                studentSparkpoint.get('student_id') == itemData.student_id &&
                studentSparkpoint.get('sparkpoint_id') == itemData.sparkpoint_id
            ) {
                // capture question input
                if (questionInputEl = me.getQuestionInputEl()) {
                    questionInputValue = questionInputEl.getValue();
                    questionInputFocused = questionInputEl.dom === document.activeElement;
                }

                questionsStore.loadRawData([itemData], true);
                me.refreshQuestions();

                // restore question input
                if (questionInputEl = me.getQuestionInputEl()) {
                    if (questionInputValue) {
                        questionInputEl.dom.value = questionInputValue;
                    }

                    if (questionInputFocused) {
                        console.log('restoring focus');
                        questionInputEl.focus();
                    }
                }
            }
        } else if (data.table == 'conference_resource_assignments_student') {
            resource = me.getWorkConferenceResourcesStore().getById(itemData.resource_id);

            if (resource) {
                if (itemData.assignment) {
                    resource.set('assignments', { section: (resource.data.assignments.section || null), student: 'required' });
                } else {
                    resource.set('assignments', { section: (resource.data.assignments.section || null) });
                }

                me.refreshResources();
            }
        } else if (data.table == 'conference_resource_assignments_section') {
            resource = me.getWorkConferenceResourcesStore().getById(itemData.resource_id);

            if (resource) {
                if (itemData.assignment) {
                    resource.set('assignments', { section: 'required', student: (resource.data.assignments.student || null) });
                } else {
                    resource.set('assignments', { student: (resource.data.assignments.student || null) });
                }

                me.refreshResources();
            }
        } else if (data.table == 'guiding_question_assignments_student') {
            question = me.getWorkConferenceQuestionsStore().getById(itemData.resource_id);

            if (question) {
                if (itemData.assignment) {
                    question.set('assignments', { section: (question.data.assignments.section || null), student: 'required' });
                } else {
                    question.set('assignments', { section: (question.data.assignments.section || null) });
                }

                me.refreshQuestions();
            }
        } else if (data.table == 'guiding_question_assignments_section') {
            question = me.getWorkConferenceQuestionsStore().getById(itemData.resource_id);

            if (question) {
                if (itemData.assignment) {
                    question.set('assignments', { section: 'required', student: (question.data.assignments.student || null) });
                } else {
                    question.set('assignments', { student: (question.data.assignments.student || null) });
                }

                me.refreshQuestions();
            }
        }
    },


    // controller methods
    refreshQuestions: function() {
        var me = this,
            questionsList = me.getQuestionsList(),
            questionsStore = me.getWorkConferenceQuestionsStore(),
            count = questionsStore.getCount(), i = 0, question, questionAssignments,
            items = [];

        if (!questionsList) {
            return;
        }

        for (; i < count; i++) {
            question = questionsStore.getAt(i);
            questionAssignments = question.get('assignments');

            items.push({
                text: question.get('question'),
                source: question.get('source'),
                assignment: questionAssignments.student || questionAssignments.section || null
            });
        }

        items.push({
            text: '<div class="inline-flex-fullwidth-ct"><input placeholder="Add a guiding question you want to discuss with the teacher (optional)" class="flex-1"> <button type="submit">Add</button></div>',
            skipHtmlEncode: true
        });

        questionsList.setData({
            title: 'Guiding Questions',
            items: items
        });
    },

    refreshResources: function() {
        var me = this,
            resourcesStore = me.getWorkConferenceResourcesStore(),
            count = resourcesStore.getCount(), i = 0, resource, resourceAssignments,
            items = [];

        for (; i < count; i++) {
            resource = resourcesStore.getAt(i);
            resourceAssignments = resource.get('assignments');

            items.push({
                text: resource.get('title'),
                linkTitle: resource.get('url'),
                linkUrl: resource.get('url'),
                assignment: resourceAssignments.student || resourceAssignments.section || null
            });
        }

        me.getResourcesList().setData({
            title: 'Resources',
            items: items
        });
    },

    refreshRequestBtn: function() {
        var requestBtn = this.getRequestBtn(),
            studentSparkpoint = this.getStudentSparkpoint(),
            conferenceStartTime = studentSparkpoint && studentSparkpoint.get('conference_start_time');

        if (!requestBtn || !studentSparkpoint) {
            return;
        }

        requestBtn.setDisabled(conferenceStartTime || !studentSparkpoint.get('learn_completed_time'));
        requestBtn.setText(conferenceStartTime ? 'Conference Requested' : requestBtn.config.text);
    },

    writeWorksheet: function() {
        var worksheetForm = this.getWorksheetForm(),
            worksheet = worksheetForm && worksheetForm.getRecord();

        if (!worksheet) {
            return;
        }

        worksheetForm.updateRecord(worksheet);

        if (worksheet.dirty) {
            worksheet.save();
        }
    },

    getQuestionInputEl: function() {
        var questionsList = this.getQuestionsList();

        return questionsList && questionsList.getInnerHtmlElement().down('input');
    }
});