/* global Ext */
/* global Slate */
/* jslint browser: true, undef: true, laxcomma:true */

/**
 * This controller monitors the active work tab and handles recording, posting, and updating time spent
 * on each phase
 *
 * TODO:
 * - Use browser visibility API to pause when tab is inactive?
 *    - Do we really want to do that though? If the student is on learn and launches out to a learn in another tab the learn timer should keep running
 *    - Maybe we only want to pause the timer when they pull up another instance of spark?
 */
Ext.define('SparkClassroomStudent.controller.ActivityTracker', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.util.TaskManager',
        'Slate.API'
    ],


    config: {
        activeSection: null,
        activeSparkpoint: null,
        activeTab: null
    },


    refs: {
        learnTab: 'spark-work-tab#learn',
        conferenceTab: 'spark-work-tab#conference',
        applyTab: 'spark-work-tab#apply',
        assessTab: 'spark-work-tab#assess'
    },

    control: {
        'spark-student-work-ct > component': {
            activate: 'onWorkTabActivate'
        }
    },

    listen: {
        controller: {
            '#': {
                sectionselect: 'onSectionSelect',
                sparkpointselect: 'onSparkpointSelect'
            }
        }
    },


    // template methods
    init: function() {
        this.lastSync = null;
        this.durations = {
            learn: null,
            conference: null,
            apply: null,
            assess: null
        };
    },


    // event handlers
    onSectionSelect: function(section) {
        this.setActiveSection(section);
    },

    onSparkpointSelect: function(sparkpoint) {
        this.setActiveSparkpoint(sparkpoint);
    },

    onWorkTabActivate: function(workTab) {
        this.setActiveTab(workTab);
    },


    // config handlers
    updateActiveTab: function(activeTab, oldTab) {
        var me = this,
            task = me.task,
            lastSync = me.lastSync,
            continueTimer = function() {
                // post initial time for incoming tab with duration = 1 and start timer afterwards
                me.flushTimer(task.start, task);
            };

        // initialize timer if needed, otherwise pause
        if (task) {
            task.stop();
        } else {
            task = me.task = Ext.util.TaskManager.newTask({
                interval: 60000,
                scope: me,
                run: me.flushTimer
            });
        }

        if (oldTab && lastSync) {
            // post remaining time for outgoing tab
            me.postTime(oldTab.getItemId(), Math.round((Date.now() - lastSync) / 1000), continueTimer);
        } else {
            continueTimer();
        }
    },


    // workflow methods
    postTime: function(phase, duration, callback, scope) {
        var me = this;

        me.lastSync = Date.now();

        Slate.API.request({
            method: 'POST',
            url: '/spark/api/work/activity',
            jsonData: {
                phase: phase,
                complete: false,
                sparkpoint: me.getActiveSparkpoint(),
                duration: duration
            },
            success: function(response) {
                var r = Ext.decode(response.responseText);

                Ext.callback(callback, scope);
            }
        });
    },

    flushTimer: function(callback, scope) {
        var me = this,
            lastSync = me.lastSync;

        me.postTime(me.getActiveTab().getItemId(), lastSync ? Math.round((Date.now() - lastSync) / 1000) : 0, callback, scope);
    }
});