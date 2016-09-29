/* global SparkClassroom */
/**
 * The Viewport controller is the first controller loaded in the application. It manages
 * the top-level framing and navigation.
 *
 * ## Responsibilities
 * - Instantiate top-level components and insert them into the global {@link Ext.Viewport} container
 * - Trigger load of the global {@link SparkClassroom.store.Sections Sections} store
 * - Handle interactions with the section selector, synchronize it with the current route, and
 * fire the {@link SparkClassroomTeacher.Application#event-sectionselect sectionselect application event}
 * - Rewrite and preprocess routes to prefix routes with selected section, transparently to the rest of the app
 */
Ext.define('SparkClassroomTeacher.controller.Viewport', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.MessageBox',
        'SparkClassroom.DurationDisplay'
    ],

    tokenSectionRe: /^([^:]+):(.*)$/,

    views: [
        'TitleBar@SparkClassroom',
        'NavBar',
        'gps.Container',
        'TabsContainer'
    ],

    stores: [
        'Sections@SparkClassroom.store',
        'Students@SparkClassroom.store'
    ],

    refs: {
        appCt: 'spark-teacher-appct',

        sparkTitleBar: {
            selector: 'spark-titlebar',
            autoCreate: true,

            xtype: 'spark-titlebar'
        },
        sectionSelect: 'spark-titlebar #sectionSelect',

        navBar: {
            selector: 'spark-teacher-navbar',
            autoCreate: true,

            xtype: 'spark-teacher-navbar',
            hidden: true
        },

        sparkGPS: {
            selector: 'spark-gps',
            autoCreate: true,

            xtype: 'spark-gps',
            hidden: true
        },

        tabsCt: {
            selector: 'spark-teacher-tabscontainer',
            autoCreate: true,

            xtype: 'spark-teacher-tabscontainer',
            hidden: true
        },
        teacherTabBar: 'spark-teacher-tabbar'
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
        }
    },

    control: {
        appCt: {
            selectedsectionchange: 'onSelectedSectionChange'
        },
        sectionSelect: {
            change: 'onSectionSelectChange'
        },
        teacherTabBar: {
            activetabchange: 'onTeacherTabChange'
        }
    },


    // controller template methods
    onLaunch: function() {
        var me = this;

        SparkClassroom.DurationDisplay.init(function() {
            me.renderViews();
        });
    },


    // event handlers
    onBeforeRedirect: function(token, resume) {
        var sectionCode = this.getAppCt().getSelectedSection();

        if (sectionCode) {
            resume(sectionCode + ':' + token);
            return false;
        }
        return true;
    },

    onBeforeRoute: function(token, resume) {
        var me = this,
            sectionMatch = token && me.tokenSectionRe.exec(token),
            sectionCode = sectionMatch && sectionMatch[1];

        if (sectionCode) {
            me.getAppCt().setSelectedSection(sectionCode);
            resume(sectionMatch[2]);
            return false;
        }
        return true;
    },

    onSelectedSectionChange: function(appCt, selectedSection) {
        var me = this,
            token = Ext.util.History.getToken(),
            sectionMatch = token && me.tokenSectionRe.exec(token),
            studentStore = Ext.getStore('Students'),
            sectionSelect = me.getSectionSelect();

        if (selectedSection) {
            if (sectionSelect) {
                sectionSelect.setValue(selectedSection);
            }

            // show section dependant components
            me.getNavBar().show();
            me.getSparkGPS().show();
            me.getTabsCt().show();

            studentStore.getProxy().setUrl('/sections/' + selectedSection + '/students');
            studentStore.load();

            // redirect with the current un-prefixed route or an empty string to write the new section into the route
            me.redirectTo((sectionMatch && sectionMatch[2]) || 'gps'); // eslint-disable-line no-extra-parens
        }
    },

    onSectionsStoreLoad: function() {
        this.getSectionSelect().setValue(this.getAppCt().getSelectedSection());
    },

    onSectionSelectChange: function(selectField, section) {
        this.getAppCt().setSelectedSection(section.get('Code'));
    },

    onTeacherTabChange: function(tabBar, value) {
        this.redirectTo(value.getItemId());
    },


    // custom controller methods
    renderViews: function() {
        var me = this;

        Ext.getStore('Sections').load();

        // add items to viewport's appCt
        me.getAppCt().add([
            me.getSparkTitleBar(),
            me.getNavBar(),
            me.getSparkGPS(),
            me.getTabsCt()
        ]);
    },
});
