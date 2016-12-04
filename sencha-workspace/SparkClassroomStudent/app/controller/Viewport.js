/**
 * Populates the top-level application viewport with its top-level
 * components and manages the top-level navigation and state of the application.
 *
 * ## Responsibilities
 * - Push new values to appCt's {@link SparkClassroomStudent.view.AppContainer#cfg-selectedSectionCode selectedSectionCode}
 * and {@link SparkClassroomStudent.view.AppContainer#cfg-selectedSparkpointCode selectedSparkpointCode} based on user
 * navigation and UI interactions
 * - Respond to appCt's {@link SparkClassroomStudent.view.AppContainer#event-selectedsectioncodechange selectedsectioncodechange} and
 * {@link SparkClassroomStudent.view.AppContainer#event-selectedsparkpointcodechange selectedsparkpointcodechange} to ensure that
 * all top-level navigation UI and navigation route reflect new selections
 * - Create/load the {@link SparkClassroom.model.StudentSparkpoint StudentSparkpoint} model instance for the selected sparkpoint
 * code and push it into appCt's' {@link SparkClassroomStudent.view.AppContainer#cfg-loadedStudentSparkpoint loadedStudentSparkpoint} once
 * available
 */
Ext.define('SparkClassroomStudent.controller.Viewport', {
    extend: 'Ext.app.Controller',
    requires: [
        /* global SparkClassroom */
        'SparkClassroom.timing.DurationDisplay'
    ],


    tokenPrefixRe: /^([^:]+)(:([^:]+))?::(.*)$/,

    views: [
        'TitleBar@SparkClassroom',
        'Welcome',
        'NavBar',
        'TabsContainer'
    ],

    stores: [
        'Sections@SparkClassroom.store',
        'Students@SparkClassroom.store',
        'SparkpointsLookup@SparkClassroom.store'
    ],

    models: [
        'StudentSparkpoint@SparkClassroom.model'
    ],

    refs: {
        appCt: 'spark-student-appct',

        sparkTitleBar: {
            selector: 'spark-titlebar',
            autoCreate: true,

            xtype: 'spark-titlebar'
        },
        sectionSelect: 'spark-titlebar #sectionSelect',
        sparkpointSelect: 'spark-student-navbar spark-sparkpointfield',

        navBar: {
            selector: 'spark-student-navbar',
            autoCreate: true,

            xtype: 'spark-student-navbar',
            hidden: true
        },
        timerCmp: 'spark-student-navbar #timer',

        welcomeCmp: {
            selector: 'spark-student-welcome',
            autoCreate: true,

            xtype: 'spark-student-welcome'
        },

        tabsCt: {
            selector: 'spark-student-tabscontainer',
            autoCreate: true,

            xtype: 'spark-student-tabscontainer',
            hidden: true
        }
    },

    listen: {
        controller: {
            '#': {
                beforeredirect: 'onBeforeRedirect',
                beforeroute: 'onBeforeRoute',
                // <debug>
                unmatchedroute: function(token) {
                    Ext.log.warn('Unmatched token: ' + token);
                }
                // </debug>
            }
        },
        store: {
            '#Sections': {
                load: 'onSectionsStoreLoad'
            }
        },
        socket: {
            data: 'onSocketData'
        }
    },

    control: {
        appCt: {
            selectedsectioncodechange: 'onSelectedSectionCodeChange',
            selectedsparkpointcodechange: 'onSelectedSparkpointCodeChange',
            loadedstudentsparkpointchange: 'onLoadedStudentSparkpointChange',
            loadedstudentsparkpointupdate: 'onLoadedStudentSparkpointUpdate'
        },
        sectionSelect: {
            change: 'onSectionSelectChange'
        },
        sparkpointSelect: {
            sparkpointselect: 'onSparkpointSelectChange'
        }
    },


    // controller template methods
    onLaunch: function() {
        var me = this;

        Ext.getStore('Sections').load();

        // add items to viewport's appCt
        me.getAppCt().add([
            me.getSparkTitleBar(),
            me.getNavBar(),
            me.getWelcomeCmp(),
            me.getTabsCt()
        ]);
    },


    // event handlers
    onBeforeRedirect: function(token, resume) {
        var appCt = this.getAppCt(),
            sectionCode = appCt.getSelectedSectionCode(),
            sparkpointCode = appCt.getSelectedSparkpointCode();

        if (sectionCode) {
            resume(sectionCode + (sparkpointCode ? ':' + sparkpointCode : '') + '::' + token);
            return false;
        }
        return true;
    },

    onBeforeRoute: function(token, resume) {
        var me = this,
            appCt = me.getAppCt(),
            prefixMatch = token && me.tokenPrefixRe.exec(token);

        if (prefixMatch) {
            appCt.setSelectedSectionCode(prefixMatch[1] || null);
            appCt.setSelectedSparkpointCode(prefixMatch[3] || null);
            resume(prefixMatch[4]);
            return false;
        }
        return true;
    },

    onSectionsStoreLoad: function() {
        this.getSectionSelect().setValue(this.getAppCt().getSelectedSectionCode());
    },

    onSocketData: function(socket, data) {
        var me = this,
            tableName = data.table,
            itemData = data.item,
            studentSparkpoint = me.getAppCt().getLoadedStudentSparkpoint();

        if (tableName === 'student_sparkpoint' || tableName === 'section_student_active_sparkpoint') {
            if (studentSparkpoint
                && studentSparkpoint.get('sparkpoint_id') === itemData.sparkpoint_id
                && studentSparkpoint.get('student_id') === itemData.student_id
            ) {
                studentSparkpoint.set(itemData, { dirty: false });
            }
        }
    },

    onSelectedSectionCodeChange: function(appCt, sectionCode) {
        var me = this,
            studentsStore = me.getStudentsStore();

        me.getAppCt().setSelectedSparkpointCode(null);

        if (sectionCode) {
            studentsStore.getProxy().setUrl('/sections/' + sectionCode + '/students');
            studentsStore.load();
        }

        // called buffered sync method
        me.syncSelections();
    },

    onSelectedSparkpointCodeChange: function(appCt, sparkpointCode) {
        var me = this,
            tabsCt = me.getTabsCt(),
            studentSparkpoint = me.getStudentSparkpointModel().create();

        if (!sparkpointCode) {
            appCt.setLoadedStudentSparkpoint(null);
            return;
        }

        // mark empty studentSparkpoint model as committed so uninitialized fields aren't considered dirty
        studentSparkpoint.commit();

        studentSparkpoint.set('sparkpoint', sparkpointCode);

        tabsCt.setMasked({
            xtype: 'loadmask',
            message: 'Opening Sparkpoint&hellip;'
        });

        studentSparkpoint.save({
            success: function() {
                tabsCt.setMasked(false);
                appCt.setLoadedStudentSparkpoint(studentSparkpoint);
            }
        });

        // call buffered sync method
        me.syncSelections();
    },

    onLoadedStudentSparkpointChange: function(appCt, studentSparkpoint) {
        var me = this,
            timerCmp = me.getTimerCmp();

        if (studentSparkpoint) {
            if (studentSparkpoint.get('total_duration') > 0) {
                timerCmp.setHtml(
                    SparkClassroom.timing.DurationDisplay.calculateDuration(appCt.getSelectedSectionCode(), studentSparkpoint.get('learn_start_time'))
                );
            } else {
                timerCmp.setHtml('Not Started');
            }
            timerCmp.show();
        } else {
            timerCmp.hide();
        }
    },

    onSectionSelectChange: function(select, section) {
        this.getAppCt().setSelectedSectionCode(section.get('Code'));
    },

    onSparkpointSelectChange: function(sparkpointSelector, sparkpoint) {
        this.getAppCt().setSelectedSparkpointCode(sparkpoint.get('sparkpoint'))
    },

    onLoadedStudentSparkpointUpdate: function(appCt, studentSparkpoint, modifiedFieldNames) {
        if (Ext.Array.contains(modifiedFieldNames, 'total_duration')) {
            this.getTimerCmp().setData({
                duration: studentSparkpoint.get('total_duration')
            });
        }
    },


    // controller methods
    syncSelections: Ext.Function.createBuffered(function() {
        var me = this,
            appCt = me.getAppCt(),
            sparkpointsLookupStore = me.getSparkpointsLookupStore(),
            sectionCode = appCt.getSelectedSectionCode(),
            sparkpointCode = appCt.getSelectedSparkpointCode(),
            token = Ext.util.History.getToken(),
            prefixMatch = token && this.tokenPrefixRe.exec(token),
            finishSync = function() {
                me.getSectionSelect().setValue(sectionCode || null);
                me.getSparkpointSelect().setValue(sparkpointCode || null);

                // show section dependant components
                me.getNavBar().setHidden(!sectionCode);
                me.getWelcomeCmp().setHidden(sectionCode && sparkpointCode);
                me.getTabsCt().setHidden(!sparkpointCode);

                // redirect with the current un-prefixed route or the default section to write the new section into the route
                me.redirectTo((prefixMatch && prefixMatch[4]) || 'work'); // eslint-disable-line no-extra-parens
            },
            latestCurrentSparkpoint;

        if (sectionCode && !sparkpointCode) {
            appCt.setMasked({
                xtype: 'loadmask',
                message: 'Resuming last sparkpoint&hellip;'
            });
            sparkpointsLookupStore.load({
                callback: function(sparkpoints, operation, success) {
                    if (success && (latestCurrentSparkpoint = sparkpointsLookupStore.getAt(0))) {
                        appCt.setSelectedSparkpointCode(latestCurrentSparkpoint.get('sparkpoint'));
                    } else {
                        finishSync();
                    }

                    appCt.setMasked(false);
                }
            });
        } else {
            finishSync();
        }
    }, 10)
});
