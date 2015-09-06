/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.Viewport', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.MessageBox'
    ],

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
        teacherTabBar: 'spark-teacher-tabbar',
    },

    listen: {
        controller: {
            '#': {
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

    onBeforeRoute: function(token, resume) {
        var sectionMatch = token && token.match(/^([^\/]+)\/(.*)$/),
            sectionCode = sectionMatch && sectionMatch[1];

        if (sectionCode) {
            console.warn('TODO: load section', sectionCode);
            resume(sectionMatch[2]);
            return false;
        }
    },

    onSectionsStoreLoad: function(store) {
        var sectionQueryString = Ext.Object.fromQueryString(location.search).section,
            sectionSelectCmp = this.getSectionSelect(),
            record = store.findRecord('Code', sectionQueryString);

        sectionSelectCmp.setValue(record);
    },

    onSectionSelectChange: function(select, newValue, oldValue) {
        var studentStore = Ext.getStore('Students'),
            sectionStore = Ext.getStore('SectionStudents'),
            classCode = newValue.get('Code'),
            queryStringObject = Ext.Object.fromQueryString(location.search),
            hash = Ext.util.History.getHash(),
            parsedQueryString;

        queryStringObject.section = classCode;
        parsedQueryString = Ext.Object.toQueryString(queryStringObject);
        location.search = parsedQueryString;

        if (oldValue == null) {
            studentStore.getProxy().setUrl('/sections/'+ classCode +'/students');
            sectionStore.removeAll();
            studentStore.load();
        }
    },

    onSparkNavBarButtonClick: function(btn) {
        var btnId = btn.getItemId();

        if (btnId == 'activity') {
            Ext.Msg.alert('Not yet available', 'Classroom activity view is not yet available');
        } else {
            this.redirectTo(btnId);
        }
    },

    onTeacherTabChange: function(tabBar, value, oldValue) {
        this.redirectTo(value.getItemId());
    }
});