/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.Viewport', {
    extend: 'Ext.app.Controller',

    tokenPrefixRe: /^([^:]+)(:([^:]+))?::(.*)$/,

    config: {
        selectedSection: null,
        selectedSparkpoint: null
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
        appCt: 'viewport > #appCt',

        sparkTitleBar: {
            selector: 'spark-titlebar',
            autoCreate: true,

            xtype: 'spark-titlebar'
        },
        sectionSelect: 'spark-titlebar #sectionSelect',
        sparkpointSelect: 'spark-student-navbar #sparkpointSelector',

        navBar: {
            selector: 'spark-student-navbar',
            autoCreate: true,

            xtype: 'spark-student-navbar',
            hidden: true
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

        // add items to viewport's appCt
        me.getAppCt().add([
            me.getSparkTitleBar(),
            me.getNavBar(),
            me.getTabsCt()
        ]);
    },

    updateSelectedSection: function(section, oldSection) {
        this.getApplication().fireEvent('sectionselect', section, oldSection);
        this.syncSelections();
    },

    updateSelectedSparkpoint: function(sparkpoint, oldSparkpoint) {
        this.getApplication().fireEvent('sparkpointselect', sparkpoint, oldSparkpoint);
        this.syncSelections();
    },

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

    onSectionsStoreLoad: function(store) {
        this.getSectionSelect().setValue(this.getSelectedSection());
    },

    onSectionSelectChange: function(select, section, oldSection) {
        this.setSelectedSection(section.get('Code'));
    },

    onSparkpointSelectChange: function(sparkpointSelector, sparkpoint) {
        this.setSelectedSparkpoint(sparkpoint.getId());
    },

    syncSelections: Ext.Function.createBuffered(function() {
        var me = this,
            sectionCode = me.getSelectedSection(),
            sparkpointCode = me.getSelectedSparkpoint(),
            token = Ext.util.History.getToken(),
            prefixMatch = token && this.tokenPrefixRe.exec(token);

        me.getSectionSelect().setValue(sectionCode || null);
        me.getSparkpointSelect().setValue(sparkpointCode || null);

        //show section dependant components
        me.getNavBar().setHidden(!sectionCode);
        me.getTabsCt().setHidden(!sectionCode);

        // redirect with the current un-prefixed route or the default section to write the new section into the route
        this.redirectTo((prefixMatch && prefixMatch[4]) || 'work');
    }, 10)
});