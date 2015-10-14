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
        conferenceCt: 'spark-teacher-work-conference',
        sparkpointCt: 'spark-teacher-work-conference #sparkpointCt',
        questionsList: 'spark-worklist#questions',
        resourcesList: 'spark-worklist#resources',
        waitingCt: 'spark-teacher-work-conference-feedback #waitingCt',
        joinConferenceCt: 'spark-teacher-work-conference-feedback #joinConferenceCt',
        conferencingCt: 'spark-teacher-work-conference-feedback #conferencingCt',
        conferencingStudentsGrid: 'spark-teacher-work-conference-feedback #conferencingStudentsGrid',
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
            selectionchange: 'onConferencingStudentsGridSelectionChange'
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
        var me = this,
            conferenceGroup = activeStudent.get('conference_group');

        me.setActiveSparkpoint(activeStudent.get('sparkpoint_code'))

        me.getWaitingCt().setHidden(!activeStudent.get('conference_ready') || conferenceGroup);
        me.getJoinConferenceCt().setHidden(!me.getWorkConferenceGroupsStore().getCount());
        me.getConferencingCt().setHidden(!conferenceGroup);
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
        this.doSetActiveStudentGroup(1 + (Ext.getStore('gps.ActiveStudents').max('conference_group') || 0));
    },

    onJoinConferenceViewItemTap: function(dataview, index, target, group, e) {
        if (e.getTarget('.spark-conference-join-btn')) {
            this.doSetActiveStudentGroup(group.getId());
        }
    },

    onConferencingStudentsGridSelectionChange: function(grid) {
        var students = grid.getSelections(),
            feedbackBtn = this.getFeedbackBtn(),
            readyBtn = this.getReadyBtn(),
            subjectText = students.length == 1 ? students[0].get('name') : students.length + ' students';

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
    },

    doSetActiveStudentGroup: function(groupId) {
        var me = this;

        me.getWaitingCt().hide();
        me.getActiveStudent().set('conference_group', groupId);
        me.getConferencingCt().show();
    }
});