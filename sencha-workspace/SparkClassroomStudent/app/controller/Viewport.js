/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.Viewport', {
    extend: 'Ext.app.Controller',

    tokenPrefixRe: /^([^:]+)(:([^:]+))?::(.*)$/,

    config: {
        selectedSection: null,
        selectedSparkpoint: null,
        studentSparkpoint: null
    },

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
        appCt: 'viewport > #appCt',

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

    control: {
        sectionSelect: {
            change: 'onSectionSelectChange'
        },
        sparkpointSelect: {
            sparkpointselect: 'onSparkpointSelectChange'
        }
    },

    listen: {
        controller: {
            '#': {
                beforeredirect: 'onBeforeRedirect',
                beforeroute: 'onBeforeRoute',
                studentsparkpointload: 'onStudentSparkpointLoad',
                studentsparkpointupdate: 'onStudentSparkpointUpdate'
                //<debug>
                ,unmatchedroute: function(token) {
                    Ext.log.warn('Unmatched token: ' + token);
                }
                //</debug>
            }
        },
        store: {
            '#Sections': {
                load: 'onSectionsStoreLoad'
            }
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


    // config handlers
    updateSelectedSection: function(section, oldSection) {
        var me = this,
            studentsStore = me.getStudentsStore();

        me.setSelectedSparkpoint(null);

        if (section) {
            studentsStore.getProxy().setUrl('/sections/' + section + '/students');
            studentsStore.load();
        }

        me.getApplication().fireEvent('sectionselect', section, oldSection);

        // called buffered sync method
        me.syncSelections();
    },

    updateSelectedSparkpoint: function(sparkpoint, oldSparkpoint) {
        var me = this,
            tabsCt = me.getTabsCt(),
            studentSparkpoint = me.getStudentSparkpointModel().create();

        me.getApplication().fireEvent('sparkpointselect', sparkpoint, oldSparkpoint);

        if (!sparkpoint) {
            me.setStudentSparkpoint(null);
            return;
        }

        // mark empty studentSparkpoint model as committed so uninitialized fields aren't considered dirty
        studentSparkpoint.commit();

        studentSparkpoint.set('sparkpoint', sparkpoint);

        tabsCt.setMasked({xtype: 'loadmask', message: 'Opening Sparkpoint&hellip;'});
        studentSparkpoint.save({
            success: function() {
                tabsCt.setMasked(false);
                me.setStudentSparkpoint(studentSparkpoint);
            }
        });

        // call buffered sync method
        me.syncSelections();
    },

    updateStudentSparkpoint: function(studentSparkpoint, oldStudentSparkpoint) {
        this.getApplication().fireEvent('studentsparkpointload', studentSparkpoint, oldStudentSparkpoint);
    },


    // event handlers
    onBeforeRedirect: function(token, resume) {
        var sectionCode = this.getSelectedSection(),
            sparkpointCode = this.getSelectedSparkpoint();

        if (sectionCode) {
            resume(sectionCode + (sparkpointCode ? ':' + sparkpointCode : '') + '::' + token);
            return false;
        }
    },

    onBeforeRoute: function(token, resume) {
        var me = this,
            prefixMatch = token && me.tokenPrefixRe.exec(token);

        if (prefixMatch) {
            me.setSelectedSection(prefixMatch[1] || null);
            me.setSelectedSparkpoint(prefixMatch[3] || null);
            resume(prefixMatch[4]);
            return false;
        }
    },

    onStudentSparkpointLoad: function(studentSparkpoint) {
        var timerCmp = this.getTimerCmp();

        if (studentSparkpoint) {
            timerCmp.setData({
                duration: studentSparkpoint.get('total_duration')
            });
            timerCmp.show();
        } else {
            timerCmp.hide();
        }
    },

    onStudentSparkpointUpdate: function(studentSparkpoint, modifiedFieldNames) {
        /* TODO enable this when local studentsparkpoint changes fire update event
        if (modifiedFieldNames.indexOf('total_duration') == -1) {
            return;
        }
        */

        this.getTimerCmp().setData({
            duration: studentSparkpoint.get('total_duration')
        });
    },

    onSectionsStoreLoad: function(store) {
        this.getSectionSelect().setValue(this.getSelectedSection());
    },

    onSectionSelectChange: function(select, section, oldSection) {
        this.setSelectedSection(section.get('Code'));
    },

    onSparkpointSelectChange: function(sparkpointSelector, sparkpoint) {
        this.setSelectedSparkpoint(sparkpoint.getId());
    },


    // controller methods
    syncSelections: Ext.Function.createBuffered(function() {
        var me = this,
            appCt = me.getAppCt(),
            sparkpointsLookupStore = me.getSparkpointsLookupStore(),
            sectionCode = me.getSelectedSection(),
            sparkpointCode = me.getSelectedSparkpoint(),
            token = Ext.util.History.getToken(),
            prefixMatch = token && this.tokenPrefixRe.exec(token),
            finishSync = function() {
                me.getSectionSelect().setValue(sectionCode || null);
                me.getSparkpointSelect().setValue(sparkpointCode || null);

                //show section dependant components
                me.getNavBar().setHidden(!sectionCode);
                me.getWelcomeCmp().setHidden(sectionCode && sparkpointCode);
                me.getTabsCt().setHidden(!sparkpointCode);

                // redirect with the current un-prefixed route or the default section to write the new section into the route
                me.redirectTo((prefixMatch && prefixMatch[4]) || 'work');
            },
            latestCurrentSparkpoint;

        if (sectionCode && !sparkpointCode) {
            appCt.setMasked({xtype: 'loadmask', message: 'Resuming last sparkpoint&hellip;'});
            sparkpointsLookupStore.load({
                callback: function(sparkpoints, operation, success) {
                    if (success && (latestCurrentSparkpoint = sparkpointsLookupStore.getAt(0))) {
                        me.setSelectedSparkpoint(latestCurrentSparkpoint.getId());
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
