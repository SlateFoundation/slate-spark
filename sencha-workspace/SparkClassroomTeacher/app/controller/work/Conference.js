/* global Slate */
/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
/**
 * TODO:
 * - Embed a store in each list that it internally binds to
 * - Move add question form processing details into a questions subclass of the list class
 */
Ext.define('SparkClassroomTeacher.controller.work.Conference', {
    extend: 'Ext.app.Controller',

    config: {
        activeStudent: null
    },

    stores: [
        'work.ConferenceQuestions@SparkClassroom.store',
        'work.ConferenceResources@SparkClassroom.store',
        'work.ConferenceGroups',
        'work.GroupFeedback'
    ],

    refs: {
        conferenceCt: 'spark-teacher-work-conference',
        sparkpointCt: 'spark-teacher-work-conference #sparkpointCt',
        questionsList: 'spark-worklist#questions',
        resourcesList: 'spark-worklist#resources',
        worksheetCmp: 'spark-teacher-work-conference-worksheet',
        waitingCt: 'spark-teacher-work-conference-feedback #waitingCt',
        joinConferenceCt: 'spark-teacher-work-conference-feedback #joinConferenceCt',
        conferencingCt: 'spark-teacher-work-conference-feedback #conferencingCt',
        timer: 'spark-teacher-work-conference-feedback spark-work-timer',
        pauseBtn: 'spark-teacher-work-conference-feedback #timerPauseBtn',
        conferencingStudentsGrid: 'spark-teacher-work-conference-studentsgrid',
        addStudentSelectField: 'spark-teacher-work-conference-studentsgrid selectfield',
        feedbackMessageField: 'spark-teacher-work-conference-feedback spark-teacher-feedbackform textareafield',
        feedbackBtn: 'spark-teacher-work-conference-feedback button#sendBtn',
        readyBtn: 'spark-teacher-work-conference-feedback button#readyBtn',

        feedbackView: 'spark-teacher-work-conference spark-feedbackview'
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
        pauseBtn: {
            tap: 'onPauseBtnTap'
        },
        timer: {
            pausedchange: 'onTimerPausedChange'
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
                update: 'onActiveStudentsStoreUpdate',
                endupdate: 'onActiveStudentsStoreEndUpdate'
            },
            '#work.Feedback': {
                load: 'onWorkFeedbackLoad'
            }
        },
        socket: {
            data: 'onSocketData'
        }
    },


    // config handlers
    updateActiveStudent: function(activeStudent) {
        var me = this,
            store = me.getWorkConferenceQuestionsStore(),
            proxy = store.getProxy(),
            conferencingStudentsGrid = me.getConferencingStudentsGrid();

        if (activeStudent) {
            // TODO: track dirty state of extraparams?
            proxy.setExtraParam('student_id', activeStudent.get('student_id'));
            proxy.setExtraParam('sparkpoint', activeStudent.get('sparkpoint'));

            // TODO: reload store if sparkpoints param dirty
            if (store.isLoaded()) {
                store.load();
            }
        }

        me.syncActiveStudent();

        me.syncConferenceGroup();

        if (conferencingStudentsGrid) {
            conferencingStudentsGrid.setSelection(activeStudent);
        }
    },


    // event handlers
    onActiveStudentSelect: function(student) {
        this.setActiveStudent(student);
    },

    onConferenceCtActivate: function() {
        this.syncActiveStudent();
        this.syncConferenceGroup();
    },

    onConferenceQuestionsStoreLoad: function(questionsStore, questions) {
        var me = this,
            rawData = questionsStore.getProxy().getReader().rawData || {},
            worksheetData = rawData.worksheet;

        me.getWorkConferenceResourcesStore().loadData(rawData.resources || []);

        me.getWorksheetCmp().setData(Ext.apply({
            peer: worksheetData && Ext.getStore('Students').getById(worksheetData.peer_id)
        }, worksheetData));

        me.refreshQuestions();
        me.refreshResources();
    },

    onWorkFeedbackLoad: function(feedbackStore) {
        this.getWorkGroupFeedbackStore().loadRecords(feedbackStore.queryRecords('phase', 'conference')); // TODO: use { addRecords: true } and smart clearing if aggregating feedback for whole group
    },

    onActiveStudentsStoreUpdate: function(activeStudentsStore, activeStudent, operation, modifiedFieldNames) {
        if (operation != 'edit') {
            return;
        }

        if (
            modifiedFieldNames.indexOf('conference_group') != -1 &&
            activeStudent.get('conference_group')
        ) {
            activeStudent.loadMasteryCheckScore('conference');

            if (!activeStudent.get('conference_join_time')) {
                activeStudent.set('conference_join_time', new Date());
                activeStudent.save();
            }
        } else if (
            modifiedFieldNames.indexOf('conference_start_time') != -1
        ) {
            this.syncConferenceGroup()
        }
    },

    onActiveStudentsStoreEndUpdate: function() {
        var activeStudentsStore = Ext.getStore('gps.ActiveStudents'),
            now = new Date(),
            groupsStore = this.getWorkConferenceGroupsStore(),
            groupIds = activeStudentsStore.collect('conference_group'),
            groupsCount = groupIds.length, i = 0,
            groupId, existingGroup, members;

        groupsStore.beginUpdate();

        for (; i < groupsCount; i++) {
            groupId = groupIds[i];
            members = activeStudentsStore.query('conference_group', groupId).getRange();

            if (existingGroup = groupsStore.getById(groupId)) {
                existingGroup.set('members', members);
            } else {
                groupsStore.add({
                    id: groupId,
                    members: members,
                    timer_started: now,
                    timer_base: now
                });
            }
        }

        groupsStore.endUpdate();
    },

    onQuestionSubmit: function() {
        var me = this,
            student = me.getActiveStudent();

        Slate.API.request({
            method: 'POST',
            url: '/spark/api/work/conferences/questions',
            jsonData: {
                student_id: student.getId(),
                sparkpoint: student.get('sparkpoint'),
                source: 'teacher',
                question: me.getQuestionInputEl().getValue()
            },
            success: function(response) {
                me.getWorkConferenceQuestionsStore().loadRawData([response.data], true);
                me.refreshQuestions();
            }
        });
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

    onPauseBtnTap: function() {
        var timer = this.getTimer();

        timer.setPaused(!timer.getPaused());
    },

    onTimerPausedChange: function(timer, paused) {
        var pauseBtn = this.getPauseBtn();

        if (pauseBtn) {
            pauseBtn.setText(paused ? 'Resume Conference' : 'Pause Conference');
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
            feedbackBtn.setText('Send feedback to ' + subjectText);
            readyBtn.setText('Mark ' + subjectText + ' Ready for Apply &rarr;');
            feedbackBtn.enable();
            readyBtn.enable();
        }
    },

    onAddStudentSelectFieldChange: function(selectField, student) {
        if (student) {
            student.set('conference_group', this.getActiveStudent().get('conference_group'));
        }
    },

    onFeedbackButtonTap: function() {
        var me = this,
            groupFeedbackStore = me.getWorkGroupFeedbackStore(),
            feedbackMessageField = me.getFeedbackMessageField(),
            message = feedbackMessageField.getValue(),
            students = me.getConferencingStudentsGrid().getSelections(),
            studentsLength = students.length,
            i = 0, student;

        if (!message) {
            Ext.Msg.alert('Feedback', 'Enter a message before sending feedback');
            return;
        }

        groupFeedbackStore.beginUpdate();

        for (; i < studentsLength; i++) {
            student = students[i];

            groupFeedbackStore.add({
                student_id: student.getId(),
                sparkpoint: student.get('sparkpoint'),
                phase: 'conference',
                message: message
            });
        }

        groupFeedbackStore.endUpdate();

        feedbackMessageField.reset();
    },

    onReadyButtonTap: function() {
        var now = new Date(),
            students = this.getConferencingStudentsGrid().getSelections(),
            studentsLength = students.length,
            i = 0, student;

        for (; i < studentsLength; i++) {
            student = students[i];

            if (!student.get('conference_finish_time')) {
                student.set('conference_finish_time', now);
                student.save();
            }
        }
    },

    onSocketData: function(socket, data) {
        var me = this,
            table = data.table,
            item = data.item,
            questionInputEl, questionInputValue, questionInputFocused,
            student, worksheetData, worksheetCmp;

        if (table == 'conference_questions') {
            student = me.getActiveStudent();

            if (student && item.student_id == student.getId() && item.sparkpoint_id == student.get('sparkpoint_id')) {
                // capture question input
                questionInputEl = me.getQuestionInputEl();
                questionInputValue = questionInputEl.getValue();
                questionInputFocused = questionInputEl.dom === document.activeElement;

                me.getWorkConferenceQuestionsStore().loadRawData([item], true);
                me.refreshQuestions();

                // restore question input
                questionInputEl = me.getQuestionInputEl();

                if (questionInputValue) {
                    questionInputEl.dom.value = questionInputValue;
                }

                if (questionInputFocused) {
                    console.log('restoring focus');
                    questionInputEl.focus();
                }
            }
        } else if (table == 'conference_worksheets') {
            student = me.getActiveStudent();

            if (student && item.student_id == student.getId() && item.sparkpoint_id == student.get('sparkpoint_id')) {
                worksheetData = Ext.decode(item.worksheet, true);
                worksheetCmp = me.getWorksheetCmp();

                if (worksheetCmp && worksheetData) {
                    worksheetCmp.setData(Ext.apply({
                        peer: Ext.getStore('Students').getById(worksheetData.peer_id)
                    }, worksheetData));
                }
            }
        }
    },


    // controller methods
    syncActiveStudent: function() {
        var me = this,
            conferenceCt = me.getConferenceCt(),
            conferenceQuestionsStore = me.getWorkConferenceQuestionsStore(),
            student = me.getActiveStudent();

        if (!conferenceCt) {
            return;
        }

        // TODO: get current sparkpoint from a better place when we move to supporting multiple sparkpoints
        if (student) {
            me.getSparkpointCt().setTitle(student.get('sparkpoint'));
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
            conferenceGroup = activeStudent && activeStudent.get('conference_group'),
            conferencingStudentsGrid = me.getConferencingStudentsGrid(),
            conferencingStudentsStore = conferencingStudentsGrid && conferencingStudentsGrid.getStore();

        if (activeStudent && me.getConferenceCt()) {
            conferencingStudentsStore.clearFilter(true);
            conferencingStudentsStore.filter('conference_group', conferenceGroup);

            if (!conferencingStudentsGrid.getSelections().length) {
                conferencingStudentsGrid.setSelection(activeStudent);
            }

            me.getWaitingCt().setHidden(!activeStudent.get('conference_start_time') || conferenceGroup);
            me.getJoinConferenceCt().setHidden(!me.getWorkConferenceGroupsStore().getCount());
            me.getConferencingCt().setHidden(!conferenceGroup);
            me.getTimer().setRecord(me.getWorkConferenceGroupsStore().getById(conferenceGroup) || null);
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
                text: question.get('question'),
                source: question.get('source')
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

    getQuestionInputEl: function() {
        return this.getQuestionsList().getInnerHtmlElement().down('input');
    }
});