/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.Viewport', {
    extend: 'Ext.app.Controller',
 
    views: [
        'work.apply.Container',
        'work.learn.Container',
        'work.conference.Container',
        'work.assess.Container'   
    ],

    stores: [
        'Sections@SparkClassroom.store'
    ],

    refs: {
        tabsCt: {
            xtype: 'spark-student-tabscontainer',
            selector: 'spark-student-tabscontainer',
            autoCreate: true
        },
        sectionSelect: {
            selector: '#sectionSelect',
            autoCreate: true
        },
        sparkStudentNavBar: {
            xtype: 'spark-student-navbar',
            selector: 'spark-student-navbar',
            autoCreate: true
        },
        workTabbar: 'spark-work-tabbar',
        sparkNavBar: {
            xtype: 'spark-navbar',
            selector:'spark-navbar',
            autoCreate: true
        },
        sectionSelect: {
            selector: '#sectionSelect',
            autoCreate: true
        },
        sparkTitleBar: {
            xtype: 'spark-titlebar',
            selector: 'spark-titlebar',
            autoCreate: true
        },
        learnCt: {
            selector: 'spark-student-work-learn',
            autoCreate: true,

            xtype: 'spark-student-work-learn'
        },
        conferenceCt: {
            selector: 'spark-student-work-conference',
            autoCreate: true,

            xtype: 'spark-student-work-conference'
        },
        applyCt: {
            selector: 'spark-student-work-apply',
            autoCreate: true,

            xtype: 'spark-student-work-apply'
        },
        assessCt: {
            selector: 'spark-student-work-assess',
            autoCreate: true,

            xtype: 'spark-student-work-assess'
        }
    },

    routes: {
        'learn': 'showLearn',
        'conference': 'showConference',
        'apply': 'showApply',
        'assess': 'showAssess'
    },

    control: {
        'spark-work-tabbar': {
            activetabchange: 'onWorkTabChange'
        },
        sectionSelect: {
            change: 'onSectionSelectChange'
        },
    },

    listen: {
        store: {
            '#Sections': {
                load: 'onSectionsStoreLoad'
            }
        }
    },
    
    init:function(){
        var me = this;

        Ext.getStore('Sections').load();

        //add items to viewport
        Ext.Viewport.add([
            me.getSparkTitleBar(),
            me.getSparkStudentNavBar(),
            me.getTabsCt()
        ]);

    },

    // route handlers
    showLearn: function() {
        //this.doShowContainer();
        this.doHighlightTabbars();
        this.doShowLearnContainer();
    },

    showConference: function() {
        //this.doShowContainer();
        this.doHighlightTabbars();
        this.doShowConferenceContainer();
    },

    showApply: function() {
        this.doHighlightTabbars();
        this.doShowApplyContainer();
    },

    showAssess: function() {
        this.doHighlightTabbars();
        this.doShowAssessContainer();
    },

    // event handlers

    onSectionsStoreLoad: function(store){
        var sectionQueryString = Ext.Object.fromQueryString(location.search).section,
            sectionSelectCmp = this.getSectionSelect(),
            record = store.findRecord('Code', sectionQueryString);

        sectionSelectCmp.setValue(record);
    },

    onSectionSelectChange: function(select, newValue, oldValue){
        var classCode = newValue.get('Code'),
            queryStringObject = Ext.Object.fromQueryString(location.search),
            hash = Ext.util.History.getHash();

        // set 'section' query string param
        queryStringObject.section = classCode;
        var parsedQueryString = Ext.Object.toQueryString(queryStringObject);

        // TODO: cross browser compatibility testing.  HTML5 only
        window.history.pushState(null ,null , '?' + parsedQueryString + '#' + hash);
    },

    onWorkTabChange: function(tabbar){
        var me = this,
            section = tabbar.getActiveTab().section;

        me.redirectTo(section);
    },

    //controller methods
    /**
     * @private
     * Called by each subsection route handler to highlight the proper tab
     */
    doHighlightTabbars: function(){
        var workTabbar = this.getWorkTabbar(),
            hash = window.location.hash,
            section = hash.substring(hash.indexOf('/') + 1, hash.length),
            assignTab = workTabbar.down(section);

        workTabbar.setActiveTab(assignTab);
    },

    /**
     * @private
     * Called by each showLearn() to add the learnCt to the tabsCt
     */
    doShowLearnContainer: function() {
        var workCt = this.getTabsCt();
        
        workCt.removeAll();
        workCt.add(this.getLearnCt());
    },

    /**
     * @private
     * Called by each showConference() to add the conferenceCt to the tabsCt
     */
    doShowConferenceContainer: function() {
        var workCt = this.getTabsCt();
        
        workCt.removeAll();
        workCt.add(this.getConferenceCt());
    },

    /**
     * @private
     * Called by each showApply() to add the applyCt to the tabsCt
     */
    doShowApplyContainer: function() {
        var workCt = this.getTabsCt();
        
        workCt.removeAll();
        workCt.add(this.getApplyCt());
    },

    /**
     * @private
     * Called by each showAssess() to add the assessCt to the tabsCt
     */
    doShowAssessContainer: function() {
        var workCt = this.getTabsCt();
        
        workCt.removeAll();
        workCt.add(this.getAssessCt());
    }

});