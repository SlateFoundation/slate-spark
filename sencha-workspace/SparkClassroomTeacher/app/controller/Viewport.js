/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.Viewport', {
    extend: 'Ext.app.Controller',

    stores: [
        'Sections@SparkClassroom.store',
        'Students',
        'gps.Learn',
        'gps.Conference',
        'gps.Apply',
        'gps.Assess',
        'gps.Priorities',
        'gps.Help'
    ],

    refs:{
        teacherTabBar: 'spark-teacher-tabbar',
        sparkNavBarButtons: 'spark-navbar button',
        sectionSelect: '#sectionSelect',
        sparkGPS: {
            xtype: 'spark-gps',
            selector: 'spark-gps',
            autoCreate: true
        },
        sparkTitleBar: {
            xtype: 'spark-titlebar',
            selector: 'spark-titlebar',
            autoCreate: true
        },
        sparkTeacherTabContainer: {
            xtype: 'spark-teacher-tabscontainer',
            selector: 'spark-teacher-tabscontainer',
            autoCreate: true
        }
    },
    
    control: {
        sectionSelect: {
            change: 'onSectionSelectChange'
        },
        teacherTabBar: {
            activetabchange: 'onTeacherTabChange'
        },
        sparkNavBarButtons: {
            tap: 'onSparkNavBarButtonClick'
        }
    },

    init:function(){
        var me = this;

        //load class section selector store
        Ext.getStore('Sections').load();
        Ext.getStore('Students').load();

        //add items to viewport
        Ext.Viewport.add([
            me.getSparkTitleBar(),
            me.getSparkGPS(),
            me.getSparkTeacherTabContainer()
        ]);

    },

    onSectionSelectChange: function(select, newValue, oldValue){
        var studentStore = Ext.getStore('Students'),
            classCode = newValue.get('Code');

        studentStore.getProxy().setUrl('/sections/'+ classCode +'/students');
        studentStore.load();
    },

    onTeacherTabChange: function(tabBar, value, oldValue) {
        this.redirectTo(value.getItemId());      
    },

    onSparkNavBarButtonClick: function(btn) {
        this.redirectTo(btn.getItemId());
    }

});