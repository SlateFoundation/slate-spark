/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.Viewport', {
    extend: 'Ext.app.Controller',

    config: {
        activeTab: null
    },
    views: [
        'tabs.Assign',
        'tabs.StudentWork',
        'tabs.Overview'
    ],
    refs:{
        studentWorkView: {
            selector: 'spark-tabs-studentwork',
            autoCreate: true,
            
            xtype: 'spark-tabs-studentwork'
        },
        competencyOverviewView: {
            selector: 'spark-tabs-overview',
            autoCreate: true,
            
            xtype: 'spark-tabs-overview'
        },
        sparkAssignView: {
            selector: 'spark-tabs-assign',
            autoCreate: true,
            
            xtype: 'spark-tabs-assign'
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
            case 'student-work':
                tab = me.getStudentWorkView();
                break;
            case 'competency-overview':
                tab = me.getCompetencyOverviewView();
                break;
            case 'sparkpoints-assign':
                tab = me.getSparkAssignView();
                break;
        }

        return tab;
    },
    
    updateActiveTab: function(newTab, oldTab) {
        //initial load contains no tab
        if (oldTab) {
            oldTab.hide();
        }

        if(Ext.Viewport.down(newTab)) {
            newTab.show();
        } else {
            Ext.Viewport.add(newTab);
        }
    },

    onTabChange: function(tabBar, newTab, oldTab) {
        this.setActiveTab(newTab.config.section);
    }
});