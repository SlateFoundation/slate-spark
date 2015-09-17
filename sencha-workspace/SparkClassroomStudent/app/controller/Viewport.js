/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.Viewport', {
    extend: 'Ext.app.Controller',

    tokenSectionRe: /^([^:]+):(.*)$/,

    config: {
        selectedSection: null
    },

    views: [
        'TitleBar@SparkClassroom',
        'NavBar',
        'TabsContainer'
    ],

    stores: [
        'Sections@SparkClassroom.store'
    ],

    refs: {
        sparkTitleBar: {
            selector: 'spark-titlebar',
            autoCreate: true,

            xtype: 'spark-titlebar'
        },
        sectionSelect: 'spark-titlebar #sectionSelect',

        navBar: {
            selector: 'spark-student-navbar',
            autoCreate: true,

            xtype: 'spark-student-navbar'
        },

        tabsCt: {
            selector: 'spark-student-tabscontainer',
            autoCreate: true,

            xtype: 'spark-student-tabscontainer'
        }
    },

    control: {
        sectionSelect: {
            change: 'onSectionSelectChange'
        }
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

    onLaunch: function() {
        var me = this;

        Ext.getStore('Sections').load();

        //add items to viewport
        Ext.Viewport.add([
            me.getSparkTitleBar(),
            me.getNavBar(),
            me.getTabsCt()
        ]);

    },

    updateSelectedSection: function(sectionCode, oldSectionCode) {
        var me = this,
            token = Ext.util.History.getToken(),
            sectionMatch = token && this.tokenSectionRe.exec(token);

        if (sectionCode) {
            //show section dependant components
            me.getNavBar().show();
            me.getTabsCt().show();

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
        var sectionQueryString = this.getSelectedSection(),
            sectionSelectCmp = this.getSectionSelect(),
            record = store.findRecord('Code', sectionQueryString);

        sectionSelectCmp.setValue(record);
    },

    onSectionSelectChange: function(select, section, oldSection) {
        this.setSelectedSection(section.get('Code'));
    }
});