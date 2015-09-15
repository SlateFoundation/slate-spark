/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.Viewport', {
    extend: 'Ext.app.Controller',


    views: [
        'TitleBar@SparkClassroom',
        'SparkStudentNavBar',
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

        sparkStudentNavBar: {
            selector: 'spark-student-navbar',
            autoCreate: true,

            xtype: 'spark-student-navbar'
        },

        tabsCt: {
            selector: 'spark-student-tabscontainer',
            autoCreate: true,

            xtype: 'spark-student-tabscontainer'
        },

        standardsCt: {
            selector: 'spark-standards',
            autoCreate: true,

            xtype: 'spark-standards'
        }
    },

    control: {
        'spark-work-tabbar': {
            activetabchange: 'onWorkTabChange'
        },
        sectionSelect: {
            change: 'onSectionSelectChange'
        }
    },

    listen: {
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
            me.getSparkStudentNavBar(),
            me.getStandardsCt(),
            me.getTabsCt()
        ]);

    },

    // event handlers
    onSectionsStoreLoad: function(store) {
        var sectionQueryString = Ext.Object.fromQueryString(location.search).section,
            sectionSelectCmp = this.getSectionSelect(),
            record = store.findRecord('Code', sectionQueryString);

        sectionSelectCmp.setValue(record);
    },

    onSectionSelectChange: function(select, newValue, oldValue) {
        var classCode = newValue.get('Code'),
            queryStringObject = Ext.Object.fromQueryString(location.search),
            parsedQueryString;

        // set 'section' query string param
        queryStringObject.section = classCode;
        parsedQueryString = Ext.Object.toQueryString(queryStringObject);
        location.search = parsedQueryString;
    },

    onWorkTabChange: function(tabbar, activeTab) {
        this.redirectTo(activeTab.getItemId());
    }

});