/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
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
        'Ext.MessageBox'
    ],

    tokenSectionRe: /^([^:]+):(.*)$/,

    config: {
        /**
         * @private
         * Tracks section last selected via {@link #event-sectionselect}
         */
        selectedSection: null
    },

    views: [
        'TitleBar@SparkClassroom',
        'NavBar',
        'gps.Container',
        'TabsContainer'
    ],

    stores: [
        'Sections@SparkClassroom.store',
        'Students@SparkClassroom.store',
        'SectionStudents@SparkClassroom.store'
    ],

    refs: {
        appCt: 'viewport > #appCt',

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
                beforeroute: 'onBeforeRoute'
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

    control: {
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

        Ext.getStore('Sections').load();

        // add items to viewport's appCt
        me.getAppCt().add([
            me.getSparkTitleBar(),
            me.getNavBar(),
            me.getSparkGPS(),
            me.getTabsCt()
        ]);
    },


    // config handlers
    updateSelectedSection: function(section, oldSection) {
        var me = this,
            token = Ext.util.History.getToken(),
            sectionMatch = token && me.tokenSectionRe.exec(token),
            studentStore = Ext.getStore('Students');

        if (section) {
            me.getSectionSelect().setValue(section);

            //show section dependant components
            me.getNavBar().show();
            me.getSparkGPS().show();
            me.getTabsCt().show();

            Ext.getStore('SectionStudents').removeAll();
            studentStore.getProxy().setUrl('/sections/' + section + '/students');
            studentStore.load();

            // redirect with the current un-prefixed route or an empty string to write the new section into the route
            me.redirectTo((sectionMatch && sectionMatch[2]) || 'gps');
        }

        me.getApplication().fireEvent('sectionselect', section, oldSection);
    },


    // event handlers
    onBeforeRedirect: function(token, resume) {
        var sectionCode = this.getSelectedSection();

        if (sectionCode) {
            resume(sectionCode + ':' + token);
            return false;
        }
    },

    onBeforeRoute: function(token, resume) {
        var me = this,
            sectionMatch = token && me.tokenSectionRe.exec(token),
            sectionCode = sectionMatch && sectionMatch[1];

        if (sectionCode) {
            me.setSelectedSection(sectionCode);
            resume(sectionMatch[2]);
            return false;
        }
    },

    onSectionsStoreLoad: function(store) {
        this.getSectionSelect().setValue(this.getSelectedSection());
    },

    onSectionSelectChange: function(selectField, section, oldSection) {
        this.setSelectedSection(section.get('Code'));
    },

    onTeacherTabChange: function(tabBar, value, oldValue) {
        this.redirectTo(value.getItemId());
    }
});