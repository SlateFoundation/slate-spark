Ext.define('SparkClassroomStudent.controller.work.Learn', {
    extend: 'Ext.app.Controller',


    config: {
        studentSparkpoint: null
    },


    stores: [
        'work.Learns@SparkClassroom.store'
    ],

    refs: {
        learnCt: 'spark-student-work-learn',
        sparkpointCt: 'spark-student-work-learn #sparkpointCt',
        progressBanner: 'spark-work-learn-progressbanner',
        learnGrid: 'spark-work-learn-grid',
        readyBtn: 'spark-student-work-learn #readyForConferenceBtn'
    },

    control: {
        learnCt: {
            activate: 'onLearnCtActivate'
        },
        readyBtn: {
            tap: 'onReadyBtnTap'
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
            '#work.Learns': {
                load: 'onLearnsStoreLoad',
                update: 'onLearnsStoreUpdate'
            }
        },
        socket: {
            data: 'onSocketData'
        }
    },

    learnsCompleted: 0,
    learnsRequiredSection: null,
    learnsRequiredStudent: null,

    // config handlers
    updateStudentSparkpoint: function(studentSparkpoint) {
        var me = this,
            store = me.getWorkLearnsStore(),
            sparkpointCt = me.getSparkpointCt(),
            sparkpointCode = studentSparkpoint && studentSparkpoint.get('sparkpoint');

        store.removeAll();

        if (!studentSparkpoint) {
            return;
        }

        store.getProxy().setExtraParam('sparkpoint', sparkpointCode);
        store.load();

        if (sparkpointCt) {
            sparkpointCt.setTitle(sparkpointCode);
        }
    },


    // event handlers
    onStudentSparkpointLoad: function(studentSparkpoint) {
        this.setStudentSparkpoint(studentSparkpoint);
    },

    onStudentSparkpointUpdate: function() {
        this.refreshLearnProgress();
    },

    onLearnCtActivate: function(learnCt) {
        var me = this,
            studentSparkpoint = me.getStudentSparkpoint();

        me.getSparkpointCt().setTitle(studentSparkpoint ? studentSparkpoint.get('sparkpoint') : 'Loading&hellip;');
        me.refreshLearnProgress();
    },

    onLearnsStoreLoad: function() {
        this.refreshLearnProgress();
        this.ensureLearnPhaseStarted();
    },

    onLearnsStoreUpdate: function() {
        this.refreshLearnProgress();
        this.ensureLearnPhaseStarted();
    },

    onSocketData: function(socket, data) {
        var me = this,
            table = data.table,
            itemData = data.item,
            studentSparkpoint, learn;

        if (table == 'learn_activity') {
            if (
                (studentSparkpoint = me.getStudentSparkpoint())
                && studentSparkpoint.get('student_id') == itemData.user_id
                && (learn = me.getWorkLearnsStore().getById(itemData.resource_id))
            ) {

                // TODO: can we find ways to not duplicate this logic between the api and the client?
                // Can there be an abstraction on the server side so that a higher-level event comes down
                // with a delta to the object as returned by the API previously so we can just pass the whole
                // data object to set?
                learn.set({
                    launched: itemData.start_status == 'launched',
                    completed: itemData.completed
                },{
                    dirty: false
                });

                me.ensureLearnPhaseStarted();
            }
        } else if (table == 'learn_assignments_section') {
            if (
                (studentSparkpoint = me.getStudentSparkpoint())
                && itemData.sparkpoint_code == studentSparkpoint.get('sparkpoint')
                && itemData.section_code == studentSparkpoint.get('section_code')
                && (learn = me.getWorkLearnsStore().getById(itemData.resource_id))
            ) {
                learn.set('assignments', Ext.applyIf({section: itemData.assignment || null}, learn.get('assignments')));

                // TODO: remove this #hack when underlying #framework-bug gets fixed
                me.getLearnGrid().refresh();
                me.syncLearnsRequired();
            }
        } else if (table == 'learn_assignments_student') {
            if (
                (studentSparkpoint = me.getStudentSparkpoint())
                && itemData.student_id == studentSparkpoint.get('student_id')
                && itemData.sparkpoint_code == studentSparkpoint.get('sparkpoint')
                && itemData.section_code == studentSparkpoint.get('section_code')
                && (learn = me.getWorkLearnsStore().getById(itemData.resource_id))
            ) {
                learn.set('assignments', Ext.applyIf({student: itemData.assignment || null}, learn.get('assignments')));

                // TODO: remove this #hack when underlying #framework-bug gets fixed
                me.getLearnGrid().refresh();
                me.syncLearnsRequired();
            }
        } else if (table == 'learns_required_section') {
            me.learnsRequiredSection = itemData.required || null;
            me.syncLearnsRequired();
        } else if (table == 'learns_required_student') {
            me.learnsRequiredStudent = itemData.required || null;
            me.syncLearnsRequired();
        }
    },

    onReadyBtnTap: function() {
        var me = this,
            studentSparkpoint = me.getStudentSparkpoint();

        if (!studentSparkpoint.get('learn_finish_time')) {
            studentSparkpoint.set('learn_finish_time', new Date());
            studentSparkpoint.save();
            me.refreshLearnProgress();
        }

        me.redirectTo('work/conference');
    },


    // controller methods
    refreshLearnProgress: function() {
        var me = this,
            progressBanner = me.getProgressBanner(),
            readyBtn = me.getReadyBtn(),
            learns = me.getWorkLearnsStore().getRange(),
            count = learns.length,
            completed = 0,
            i = 0,
            rawData = me.getWorkLearnsStore().getProxy().getReader().rawData;

        if (!progressBanner || !readyBtn) {
            // learns tab hasn't been activated yet
            return;
        }

        if (rawData && rawData.learns_required) {
            me.learnsRequiredSection = rawData.learns_required.section;
            me.learnsRequiredStudent = rawData.learns_required.student;
        }

        if (count) {
            for (; i < count; i++) {
                if (learns[i].get('completed')) {
                    completed++;
                }
            }

            me.learnsCompleted = completed;

            me.syncLearnsRequired();

            progressBanner.show();
        } else {
            progressBanner.hide();
        }
    },

    syncLearnsRequired: function() {
        var me = this,
            progressBanner = me.getProgressBanner(),
            readyBtn = me.getReadyBtn(),
            studentSparkpoint = me.getStudentSparkpoint(),
            learnFinishTime = studentSparkpoint && studentSparkpoint.get('learn_finish_time'),
            learns = me.getWorkLearnsStore().getRange(),
            count = learns.length,
            i = 0,
            learnsRequiredDisabled = false,
            required = 5,
            learn, learnAssignments;

        if (me.learnsRequiredStudent !== null) {
            required = me.learnsRequiredStudent;
        } else if (me.learnsRequiredSection !== null) {
            required = me.learnsRequiredSection;
        }

        for (; i < count; i++) {
            learn = learns[i];
            learnAssignments = learn.get('assignments');
            if ((learnAssignments.section == 'required-first' || learnAssignments.student == 'required-first'
                || learnAssignments.section == 'required' || learnAssignments.student == 'required')) {
                if (!learn.get('completed')) {
                    learnsRequiredDisabled = true;
                }
            }
        }

        progressBanner.setData({
            completedLearns: me.learnsCompleted,
            name: null,
            requiredLearns: required
        });

        if (!learnsRequiredDisabled) {
            learnsRequiredDisabled = me.learnsCompleted < required;
        }

        readyBtn.setDisabled(learnFinishTime || learnsRequiredDisabled);
        readyBtn.setText(learnFinishTime ? 'Conference Started': readyBtn.config.text);
    },

    ensureLearnPhaseStarted: function() {
        var studentSparkpoint = this.getStudentSparkpoint();

        // mark learn phase as started if any learn has been launched
        if (
            studentSparkpoint &&
            !studentSparkpoint.get('learn_start_time') &&
            this.getWorkLearnsStore().findExact('launched', true) != -1
        ) {
            studentSparkpoint.set('learn_start_time', new Date());
            studentSparkpoint.save();
        }
    }
});