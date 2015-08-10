/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.Viewport', {
    extend: 'Ext.app.Controller',
    
    config: {
        activeTab: null
    },
    views: [
        'assign.points.TabBar',
        'competencies.Main',
        'work.Main'
    ],
    refs:{
        workMainCt: {
            selector: 'spark-teacher-work',
            autoCreate: true,

            xtype: 'spark-teacher-work'
        },
        competenciesMainCt: {
            selector: 'spark-competencies',
            autoCreate: true,

            xtype: 'spark-competencies'
        },
        assignMainTabbar: {
            selector: 'spark-assign-points-tabbar',
            autoCreate: true,

            xtype: 'spark-assign-points-tabbar'
        },
        sparkTabBar: 'viewport spark-tabbar'
    },
    
    routes: {
        ':section': {
            action: 'showSection',
            conditions: {
                ':section': '(.+[^\/])'
            }
        },
        ':section/:view': {
            action: 'showSectionComponent',
            conditions: {
                ':section': '(.+[^\/])',
                ':view': '(.+[^\/])'
            }
        }
    },

    control: {
        'viewport spark-tabbar': {
            activetabchange: 'onTabChange'
        }
    },

    applyActiveTab: function(tab) {
        var me = this,
            section;

        if (Ext.isString(tab)) {
            section = tab;
        } else if (tab.isXtype('button')) {
            section = tab.config.section;
        }

        switch(section) {
            case 'work':
                tab = me.getWorkMainCt();
                break;
            case 'competencies':
                tab = me.getCompetenciesMainCt();
                break;
            case 'assign':
                tab = me.getAssignMainTabbar();
                break;
        }

        return tab;
    },

    updateActiveTab: function (newTab, oldTab) {
        //initial load contains no tab
        if (oldTab) {
            oldTab.hide();
            oldTab.fireEvent('sectionclose', oldTab);
        }

        if(Ext.Viewport.down(newTab)) {
            newTab.show();
        } else {
            Ext.Viewport.add(newTab);
        }
    },

    onTabChange: function(tabBar, newTab, oldTab) {
        this.setActiveTab(newTab.config.section);
    },
    
    showSection: function (section) {
        var tabBar = this.getSparkTabBar(),
            tab = tabBar.down('[section='+section+']');

        tabBar.setActiveTab(tab);
    },
    
    showSectionComponent: function(section, view) {
        var me = this,
            sectionCmp, tabBar;
        
        me.showSection(section);
        
        switch(section) {
            case 'work':
                sectionCmp = me.getWorkMainCt();
                break;
            case 'competencies':
                sectionCmp = me.getCompetenciesMainCt();
                break;
            case 'assign':
                sectionCmp = me.getAssignMainTabbar();
                break;
        }
        
        sectionCmp.fireEvent('viewselected', view);
    }
});