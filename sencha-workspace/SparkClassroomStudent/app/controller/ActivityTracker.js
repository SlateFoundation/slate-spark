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

    onTaskInterval: function() {
        console.info('tick');
    },

    // onPostResponse: function(response) {

    // },


    // config handlers
    updateActiveTab: function(activeTab, oldActiveTab) {
        var me = this,
            task = me.task,
            lastSync = me.lastSync,
            durations = me.durations,
            now = Date.now();

        // initialize timer if needed, otherwise pause
        if (task) {
            task.stop();
        } else {
            task = me.task = Ext.util.TaskManager.newTask({
                interval: 5000,
                scope: me,
                run: me.onTaskInterval
            });
        }

        // TODO: post remaining time for outgoing tab
        if (oldActiveTab && lastSync) {
            //debugger;
        }

        // TODO: post initial time for incoming tab with duration = 0
        Slate.API.request({
            method: 'POST',
            url: '/spark/api/work/activity',
            urlParams: {
                section_id: 1, // TODO: send actual section when it will accept section code
            },
            jsonData: {
                phase: activeTab.getItemId(),
                complete: false,
                sparkpoint: me.getActiveSparkpoint(),
                duration: lastSync ? Math.round((now - lastSync) / 1000) : 1
            },
            success: function(response) {
                var r = Ext.decode(response.responseText);

                me.lastSync = now;// last sync should get updated before the request is sent so it lines up with the sent duration

                durations.learn = r.learn_duration;
                durations.conference = r.conference_duration;
                durations.apply = r.apply_duration;
                durations.assess = r.assess_duration;

                // (re)start timer
                task.start();
            }
        });
    }
});