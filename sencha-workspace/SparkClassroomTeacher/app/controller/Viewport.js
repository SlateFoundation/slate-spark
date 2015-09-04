/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.Viewport', {
    extend: 'Ext.app.Controller',

    stores: [
        'Sections@SparkClassroom.store',
        'Students@SparkClassroom.store',
        'SectionStudents@SparkClassroom.store',
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
        sectionSelect: {
            selector: '#sectionSelect',
            autoCreate: true
        },
        sparkGPS: {
            selector: 'spark-gps',
            autoCreate: true,

            xtype: 'spark-gps'
        },
        sparkTitleBar: {
            selector: 'spark-titlebar',
            autoCreate: true,
            
            xtype: 'spark-titlebar'
        },
        sparkTeacherTabContainer: {
            selector: 'spark-teacher-tabscontainer',
            autoCreate: true,

            xtype: 'spark-teacher-tabscontainer'
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

    listen: {
        store: {
            '#Students': {
                load: 'onStudentsStoreLoad'
            },
            '#Sections': {
                load: 'onSectionsStoreLoad'
            }
        }
    },

    onLaunch:function(){
        var me = this;

        Ext.getStore('Sections').load();

        //add items to viewport
        Ext.Viewport.add([
            me.getSparkTitleBar(),
            me.getSparkGPS(),
            me.getSparkTeacherTabContainer()
        ]);

    },

    onSectionsStoreLoad: function(store){
        var sectionQueryString = Ext.Object.fromQueryString(location.search).section,
            sectionSelectCmp = this.getSectionSelect(),
            record = store.findRecord('Code', sectionQueryString);

        sectionSelectCmp.setValue(record);
    },

    onStudentsStoreLoad: function(store, records){
        var sectionStore = Ext.getStore('SectionStudents');

        for(var i = 0; i < records.length; i++){

            // temp mock data generation script
            var status = ['Learn', 'Conference', 'Apply', 'Assess'],
                grades = ['L', '*', 'G', 'N'];
                mod = i % 4,
                randomIncrement = Math.floor(Math.random() * 4),
                record = records[i];

            // add data from students store to SectionStudentStore
            sectionStore.add({
                Student: record.getData(),
                Section: status[randomIncrement],
                GPSStatus: status[randomIncrement],
                GPSStatusGroup: 24,
                Help: mod == 2 ? true : '',
                Priority: mod == 2 ? 2 : '',
                Standards: ['CC.Content', 'CC.SS.Math.Content'],
                Grade: grades[randomIncrement]
            });

        }

    },

    onSectionSelectChange: function(select, newValue, oldValue){
        var studentStore = Ext.getStore('Students'),
            sectionStore = Ext.getStore('SectionStudents'),
            classCode = newValue.get('Code'),
            queryStringObject = Ext.Object.fromQueryString(location.search),
            hash = Ext.util.History.getHash(),
            parsedQueryString;

        queryStringObject.section = classCode;
        parsedQueryString = Ext.Object.toQueryString(queryStringObject);
        location.search = parsedQueryString;

        if(oldValue == null){
            studentStore.getProxy().setUrl('/sections/'+ classCode +'/students');
            sectionStore.removeAll();
            studentStore.load();
        }


    },

    onTeacherTabChange: function(tabBar, value, oldValue) {
        this.redirectTo(value.getItemId());      
    },

    onSparkNavBarButtonClick: function(btn) {
        this.redirectTo(btn.getItemId());
    }

});