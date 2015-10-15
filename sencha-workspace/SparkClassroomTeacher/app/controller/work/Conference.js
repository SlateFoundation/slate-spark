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
        'work.ConferenceResources@SparkClassroom.store',
        'work.ConferenceGroups'
    ],

    refs: {
        gpsList: 'spark-gps-studentlist#conferenceList',

        conferenceCt: 'spark-teacher-work-conference',
        sparkpointCt: 'spark-teacher-work-conference #sparkpointCt',
        questionsList: 'spark-worklist#questions',
        resourcesList: 'spark-worklist#resources',
        waitingCt: 'spark-teacher-work-conference-feedback #waitingCt',
        joinConferenceCt: 'spark-teacher-work-conference-feedback #joinConferenceCt',
        conferencingCt: 'spark-teacher-work-conference-feedback #conferencingCt',
        conferencingStudentsGrid: 'spark-teacher-work-conference-studentsgrid',
        addStudentSelectField: 'spark-teacher-work-conference-studentsgrid selectfield',
        feedbackSubjectField: 'spark-teacher-work-conference-feedback #feedbackSubjectField',
        feedbackMessageField: 'spark-teacher-work-conference-feedback #feedbackMessageField',
        feedbackBtn: 'spark-teacher-work-conference-feedback #feedbackBtn',
        readyBtn: 'spark-teacher-work-conference-feedback #readyBtn'
    },

    control: {
        conferenceCt: {
            activate: 'onConferenceCtActivate'
        },
        questionsList: {
            submit: 'onQuestionSubmit'
        },
        'spark-teacher-work-conference-feedback button#startConferenceBtn': {
            tap: 'onStartConferenceButtonTap'
        },
        'spark-teacher-work-conference-feedback #joinConferenceCt dataview': {
            itemtap: 'onJoinConferenceViewItemTap'
        },
        conferencingStudentsGrid: {
            itemdismisstap: 'onConferencingStudentsGridItemDismissTap',
            selectionchange: 'onConferencingStudentsGridSelectionChange'
        },
        addStudentSelectField: {
            change: 'onAddStudentSelectFieldChange'
        },
        feedbackBtn: {
            tap: 'onFeedbackButtonTap'
        },
        readyBtn: {
            tap: 'onReadyButtonTap'
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
            },
            '#gps.ActiveStudents': {
                endupdate: 'onActiveStudentsStoreEndUpdate'
            }
        }
    },


    // config handlers
    updateActiveStudent: function(activeStudent) {
        var me = this;

        me.setActiveSparkpoint(activeStudent.get('sparkpoint_code'));
        me.syncConferenceGroup();
        me.getConferencingStudentsGrid().setSelection(activeStudent);
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

    onActiveStudentsStoreEndUpdate: function() {
        var activeStudentsStore = Ext.getStore('gps.ActiveStudents'),
            groupsStore = this.getWorkConferenceGroupsStore(),
            groupIds = activeStudentsStore.collect('conference_group'),
            groupsCount = groupIds.length, i = 0, groupId,
            groups = [];

        for (; i < groupsCount; i++) {
            groupId = groupIds[i];

            groups.push({
                id: groupId,
                members: activeStudentsStore.query('conference_group', groupId).getRange()
            });
        }

        groupsStore.loadData(groups);
    },

    onQuestionSubmit: function(questionsList) {
        this.getWorkConferenceQuestionsStore().add({
            question: questionsList.getInnerHtmlElement().down('input').getValue(),
            studentSubmitted: true
        });

        this.refreshQuestions();
    },

    onStartConferenceButtonTap: function() {
        this.getActiveStudent().set('conference_group', 1 + (Ext.getStore('gps.ActiveStudents').max('conference_group') || 0));
        this.syncConferenceGroup();
    },

    onJoinConferenceViewItemTap: function(dataview, index, target, group, e) {
        if (e.getTarget('.spark-conference-join-btn')) {
            this.getActiveStudent().set('conference_group', group.getId());
            this.syncConferenceGroup();
        }
    },

    onConferencingStudentsGridItemDismissTap: function(grid, item) {
        item.getRecord().set('conference_group', null);
        this.syncConferenceGroup();
    },

    onConferencingStudentsGridSelectionChange: function(grid) {
        var students = grid.getSelections(),
            feedbackBtn = this.getFeedbackBtn(),
            readyBtn = this.getReadyBtn(),
            subjectText = students.length == 1 ? students[0].get('student_name') : students.length + ' students';

        if (students.length == 0) {
            feedbackBtn.setText(feedbackBtn.config.text);
            readyBtn.setText(readyBtn.config.text);
            feedbackBtn.disable();
            readyBtn.disable();
        } else {
            feedbackBtn.setText('Leave feedback for ' + subjectText);
            readyBtn.setText('Mark ' + subjectText + ' ready for Apply &rarr;');
            feedbackBtn.enable();
            readyBtn.enable();
        }
    },

    onAddStudentSelectFieldChange: function(selectField, student) {
        if (student) {
            student.set('conference_group', this.getActiveStudent().get('conference_group'));

            // TODO: remove this hack, figure out why the list doesn't refresh itself consistently when conference_group gets set
            this.getGpsList().refresh();
        }
    },

    onFeedbackButtonTap: function() {
        var me = this,
            feedbackSubjectField = me.getFeedbackSubjectField(),
            feedbackMessageField = me.getFeedbackMessageField(),
            students = this.getConferencingStudentsGrid().getSelections(),
            studentsLength = students.length,
            i = 0, student,
            feedback = {
                subject: feedbackSubjectField.getValue(),
                message: feedbackMessageField.getValue()
            };

        for (; i < studentsLength; i++) {
            student = students[i];
            student.get('conference_feedback').push(feedback);
            student.set('conference_feedback_count'); // force count to refresh
        }

        feedbackSubjectField.reset();
        feedbackMessageField.reset();
    },

    onReadyButtonTap: function() {
        var now = new Date(),
            students = this.getConferencingStudentsGrid().getSelections(),
            studentsLength = students.length,
            i = 0, student;

        for (; i < studentsLength; i++) {
            student = students[i];

            if (!student.get('conference_done')) {
                student.set('conference_done', now);
            }
        }
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

    syncConferenceGroup: function() {
        var me = this,
            activeStudent = me.getActiveStudent(),
            conferenceGroup = activeStudent.get('conference_group'),
            conferencingStudentsGrid = me.getConferencingStudentsGrid(),
            conferencingStudentsStore =conferencingStudentsGrid.getStore();

        conferencingStudentsStore.clearFilter(true);
        conferencingStudentsStore.filter('conference_group', conferenceGroup);

        if (!conferencingStudentsGrid.getSelections().length) {
            conferencingStudentsGrid.setSelection(activeStudent);
        }

        me.getWaitingCt().setHidden(!activeStudent.get('conference_ready') || conferenceGroup);
        me.getJoinConferenceCt().setHidden(!me.getWorkConferenceGroupsStore().getCount());
        me.getConferencingCt().setHidden(!conferenceGroup);

        // TODO: remove this hack, figure out why the list doesn't refresh itself consistently when conference_group gets set
        me.getGpsList().refresh();
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