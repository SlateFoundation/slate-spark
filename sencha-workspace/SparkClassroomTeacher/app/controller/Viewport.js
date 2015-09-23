/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.Viewport', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.MessageBox'
    ],

    tokenSectionRe: /^([^:]+):(.*)$/,

    config: {
        selectedSection: null
    },

    views: [
        'TitleBar@SparkClassroom',
        'NavBar',
        'gps.Main',
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

    updateSelectedSection: function(sectionCode, oldSectionCode) {
        var me = this,
            token = Ext.util.History.getToken(),
            sectionMatch = token && this.tokenSectionRe.exec(token),
            studentStore = Ext.getStore('Students');

        if (sectionCode) {
            me.getSectionSelect().setValue(sectionCode);

            //show section dependant components
            me.getNavBar().show();
            me.getSparkGPS().show();
            me.getTabsCt().show();

            Ext.getStore('SectionStudents').removeAll();
            studentStore.getProxy().setUrl('/sections/' + sectionCode + '/students');
            studentStore.load();

            // redirect with the current un-prefixed route or an empty string to write the new section into the route
            this.redirectTo((sectionMatch && sectionMatch[2]) || 'gps');
        }
    },

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