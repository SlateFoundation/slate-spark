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
        'NavBar@SparkClassroom',
        'gps.Main',
        'TabsContainer'
    ],

    stores: [
        'Sections@SparkClassroom.store',
        'Students@SparkClassroom.store',
        'SectionStudents@SparkClassroom.store'
    ],

    refs: {
        sparkTitleBar: {
            selector: 'spark-titlebar',
            autoCreate: true,

            xtype: 'spark-titlebar'
        },
        sectionSelect: 'spark-titlebar #sectionSelect',

        sparkNavBar: {
            selector: 'spark-navbar',
            autoCreate: true,

            xtype: 'spark-navbar',
            hidden: true
        },

        sparkGPS: {
            selector: 'spark-gps',
            autoCreate: true,

            xtype: 'spark-gps',
            hidden: true
        },

        sparkTeacherTabContainer: {
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
        'spark-navbar button': {
            tap: 'onSparkNavBarButtonClick'
        },
        teacherTabBar: {
            activetabchange: 'onTeacherTabChange'
        }
    },

    onLaunch: function() {
        var me = this;

        Ext.getStore('Sections').load();

        //add items to viewport
        Ext.Viewport.add([
            me.getSparkTitleBar(),
            me.getSparkNavBar(),
            me.getSparkGPS(),
            me.getSparkTeacherTabContainer()
        ]);
    },

    updateSelectedSection: function(sectionCode, oldSectionCode) {
        var me = this,
            token = Ext.util.History.getToken(),
            sectionMatch = token && this.tokenSectionRe.exec(token),
            studentStore = Ext.getStore('Students');

        if (sectionCode) {
            //show section dependant components
            me.getSparkNavBar().show();
            me.getSparkGPS().show();
            me.getSparkTeacherTabContainer().show();

            Ext.getStore('SectionStudents').removeAll();
            studentStore.getProxy().setUrl('/sections/' + sectionCode + '/students');
            studentStore.load();

            // redirect with the current un-prefixed route or an empty string to write the new section into the route
            this.redirectTo((sectionMatch && sectionMatch[2]) || '');
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
        var sectionQueryString = this.getSelectedSection(),
            sectionSelectCmp = this.getSectionSelect(),
            record = store.findRecord('Code', sectionQueryString);

        sectionSelectCmp.setValue(record);
    },

    onSectionSelectChange: function(selectField, section, oldSection) {
        this.setSelectedSection(section.get('Code'));
    },

    onSparkNavBarButtonClick: function(btn) {
        var btnId = btn.getItemId();

        // Commented out until logic approved then deletable
        // if (btnId == 'activity') {
        //     Ext.Msg.alert('Not yet available', 'Classroom activity view is not yet available');
        // } else {
        //     this.redirectTo(btnId);
        // }
        if (btnId != 'activity') {
            this.redirectTo(btnId);
        }
    },

    onTeacherTabChange: function(tabBar, value, oldValue) {
        this.redirectTo(value.getItemId());
    }
});