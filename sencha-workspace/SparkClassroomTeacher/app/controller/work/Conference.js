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
        selectedSection: null,
        activeStudent: null
    },

    stores: [
        'work.ConferenceQuestions@SparkClassroom.store',
        'work.ConferenceResources@SparkClassroom.store',
        'work.ConferenceGroups@SparkClassroom.store'
    ],

    models: [
        'work.ConferenceGroup@SparkClassroom.model'
    ],

    refs: {
        conferenceCt: 'spark-teacher-work-conference',
        sparkpointCt: 'spark-teacher-work-conference #sparkpointCt',
        questionsList: 'spark-worklist#questions',
        resourcesList: 'spark-worklist#resources',
        worksheetCmp: 'spark-teacher-work-conference-worksheet',
        waitingCt: 'spark-teacher-work-conference-feedback #waitingCt',
        joinConferenceCt: 'spark-teacher-work-conference-feedback #joinConferenceCt',
        joinConeferenceDataview: 'spark-teacher-work-conference-feedback #joinConferenceCt dataview',
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
            statechange: 'onTimerStateChange'
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
                sectionselect: 'onSectionSelect',
                activestudentselect: 'onActiveStudentSelect'
            }
        },
        store: {
            '#work.ConferenceQuestions': {
                load: 'onConferenceQuestionsStoreLoad'
            },
            '#gps.ActiveStudents': {
                load: 'onActiveStudentsStoreLoad',
                update: 'onActiveStudentsStoreUpdate'
            },
            '#work.ConferenceGroups': {
                load: 'onConferenceGroupsStoreLoad'
            }
        },
        socket: {
            data: 'onSocketData'
        }
    },


    // config handlers
    updateSelectedSection: function(section) {
        var groupsStore = this.getWorkConferenceGroupsStore();

        if (section && groupsStore.isLoaded()) {
            groupsStore.load();
        }
    },

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
    onSectionSelect: function(section) {
        this.setSelectedSection(section);
    },

    onActiveStudentSelect: function(student) {
        this.setActiveStudent(student);
    },

    onConferenceCtActivate: function() {
        var me = this,
            groupsStore = me.getWorkConferenceGroupsStore();

        me.syncActiveStudent();
        me.syncConferenceGroup();

        if (!groupsStore.isLoaded()) {
            groupsStore.load();
        }
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

    onActiveStudentsStoreLoad: function() {
        this.syncConferenceGroupMembers();
    },

    onActiveStudentsStoreUpdate: function(activeStudentsStore, activeStudent, operation, modifiedFieldNames) {
        var me = this;

        if (operation != 'edit') {
            return;
        }

        if (
            activeStudent === me.getActiveStudent() &&
            (
                modifiedFieldNames.indexOf('conference_start_time') != -1 ||
                modifiedFieldNames.indexOf('conference_group_id') != -1
            )
        ) {
            me.syncConferenceGroup();
        }

        if (modifiedFieldNames.indexOf('conference_group_id') != -1) {
            me.syncConferenceGroupMembers();
        }
    },

    onConferenceGroupsStoreLoad: function() {
        this.syncConferenceGroupMembers();
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
        var me = this,
            activeStudent = me.getActiveStudent(),
            group = me.getWorkConferenceGroupModel().create({
                section_id: me.getSelectedSection()
            });

        group.save({
            callback: function(group, operation, success) {
                if (success) {
                    me.getWorkConferenceGroupsStore().add(group);
                    activeStudent.saveConferenceGroup(group.getId());
                    me.syncConferenceGroup();
                } else {
                    Ext.Logger.warn('Failed to create conference group');
                }
            }
        });
    },

    onJoinConferenceViewItemTap: function(dataview, index, target, group, e) {
        var activeStudent = this.getActiveStudent();

        if (e.getTarget('.spark-conference-join-btn')) {
            activeStudent.saveConferenceGroup(group.getId());
            this.syncConferenceGroup();
        }
    },

    onPauseBtnTap: function() {
        var timer = this.getTimer();

        timer.toggle();
    },

    onTimerStateChange: function(timer, state) {
        var pauseBtn = this.getPauseBtn(),
            text, disabled = false;

        if (!pauseBtn) {
            return;
        }

        switch (state) {
            case 'idle':
                text = 'Conference Pending';
                disabled = true;
                break;
            case 'paused':
                text = 'Resume Conference';
                break;
            case 'running':
                text = 'Pause Conference';
                break;
            case 'stopped':
                text = 'Conference Finished';
                disabled = true;
                break;
        }

        pauseBtn.setText(text);
        pauseBtn.setDisabled(disabled);
    },

    onConferencingStudentsGridItemDismissTap: function(grid, item) {
        var activeStudent = item.getRecord();

        activeStudent.saveConferenceGroup(null);

        if (activeStudent === this.getActiveStudent()) {
            this.syncConferenceGroup();
        }
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
            student.saveConferenceGroup(this.getActiveStudent().get('conference_group_id'));
            selectField.setValue(null);
        }
    },

    onFeedbackButtonTap: function() {
        var me = this,
            feedbackStore = Ext.getStore('work.Feedback'),
            feedbackMessageField = me.getFeedbackMessageField(),
            message = feedbackMessageField.getValue(),
            students = me.getConferencingStudentsGrid().getSelections(),
            studentsLength = students.length,
            i = 0, student;

        if (!message) {
            Ext.Msg.alert('Feedback', 'Enter a message before sending feedback');
            return;
        }

        feedbackStore.beginUpdate();

        for (; i < studentsLength; i++) {
            student = students[i];
            feedbackStore.add({
                student_id: student.getId(),
                sparkpoint: student.get('sparkpoint'),
                phase: 'conference',
                message: message
            });
        }

        feedbackStore.endUpdate();

        feedbackMessageField.reset();
    },

    onReadyButtonTap: function() {
        var now = new Date(),
            studentsGrid = this.getConferencingStudentsGrid(),
            selectedStudents = studentsGrid.getSelections(),
            selectedStudentsLength = selectedStudents.length,
            i = 0, student,
            unreadyStudentIndex, group;

        for (; i < selectedStudentsLength; i++) {
            student = selectedStudents[i];

            if (!student.get('conference_finish_time')) {
                student.set('conference_finish_time', now);
                student.save();
            }
        }

        unreadyStudentIndex = studentsGrid.getStore().findBy(function(student) {
            return !student.get('conference_finish_time');
        });

        if (
            unreadyStudentIndex == -1 &&
            (group = this.getWorkConferenceGroupsStore().getById(student.get('conference_group_id')))
        ) {
            group.close();
        }
    },

    onSocketData: function(socket, data) {
        var me = this,
            table = data.table,
            item = data.item,
            questionInputEl, questionInputValue, questionInputFocused,
            student, worksheetData, worksheetCmp, group;

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
        } else if (table == 'conference_groups') {
            if (group = me.getWorkConferenceGroupsStore().getById(item.id)) {
                group.set(item, { dirty: false });
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
            conferenceGroup = activeStudent && activeStudent.get('conference_group_id'),
            conferencingStudentsGrid = me.getConferencingStudentsGrid(),
            conferencingStudentsStore = conferencingStudentsGrid && conferencingStudentsGrid.getStore();

        if (activeStudent && me.getConferenceCt()) {
            conferencingStudentsStore.clearFilter(true);
            conferencingStudentsStore.filter('conference_group_id', conferenceGroup);

            if (!conferencingStudentsGrid.getSelections().length) {
                conferencingStudentsGrid.setSelection(activeStudent);
            }

            me.getWaitingCt().setHidden(!activeStudent.get('conference_start_time') || conferenceGroup);
            me.getJoinConferenceCt().setHidden(!me.getJoinConeferenceDataview().getStore().getCount());
            me.getConferencingCt().setHidden(!conferenceGroup);
            me.getTimer().setRecord(me.getWorkConferenceGroupsStore().getById(conferenceGroup) || null);
        }
    },

    syncConferenceGroupMembers: function() {
        var joinConeferenceDataview = this.getJoinConeferenceDataview(),
            activeStudentsStore = Ext.getStore('gps.ActiveStudents'),
            groupsStore = this.getWorkConferenceGroupsStore(),
            groups = groupsStore.getRange(),
            groupsCount = groups.length,
            i = 0, group, members,
            filterReadyStudents = function(student) {
                return !student.get('conference_finish_time');
            };

        if (!groupsStore.isLoaded() || !activeStudentsStore.isLoaded()) {
            return;
        }

        groupsStore.beginUpdate();

        for (; i < groupsCount; i++) {
            group = groups[i];
            members = activeStudentsStore.query('conference_group_id', group.getId());

            group.beginEdit();

            group.set({ members: members.getRange() }, { dirty: false });

            // close group if all students are ready
            if (!members.findBy(filterReadyStudents)) {
                group.close();
            }

            group.endEdit();
        }

        groupsStore.endUpdate();

        // Force dataview to refresh after store changes
        // TODO: remove this #hack when underlying #framework-bug gets fixed
        if (joinConeferenceDataview) {
            joinConeferenceDataview.refresh();
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