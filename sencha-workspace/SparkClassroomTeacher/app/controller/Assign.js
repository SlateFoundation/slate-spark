/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.Assign', {
    extend: 'Ext.app.Controller',

    views: [
        'assign.Container',
        'assign.learn.Container',
        'assign.questions.Container',
        'assign.resources.Container',
        'assign.apply.Container',
        'assign.assess.Container'
    ],

    stores: [
        'assign.Learn',
        'assign.Questions',
        'assign.Resources',
        'assign.Apply',
        'assign.Assess'
    ],

    refs:{
        tabsCt: 'spark-teacher-tabscontainer',
        assignTabbar: 'spark-teacher-assign-tabbar',
        teacherTabbar: 'spark-teacher-tabbar',
        assignCt: {
            selector: 'spark-teacher-assign-ct',
            autoCreate: true,

            xtype: 'spark-teacher-assign-ct'
        },
        learnCt: {
            selector: 'spark-assign-learn',
            autoCreate: true,

            xtype: 'spark-assign-learn'
        },
        questionsCt: {
            selector: 'spark-assign-questions',
            autoCreate: true,

            xtype: 'spark-assign-questions'
        },
        resourcesCt: {
            selector: 'spark-assign-resources',
            autoCreate: true,

            xtype: 'spark-assign-resources'
        },
        applyCt: {
            selector: 'spark-assign-apply',
            autoCreate: true,

            xtype: 'spark-assign-apply'
        },
        assessCt: {
            selector: 'spark-assign-assess',
            autoCreate: true,

            xtype: 'spark-assign-assess'
        }
    },

    control: {
      assignTabbar: {
          activetabchange: 'onAssignTabChange'
      }
    },

    routes: {
        'assign': {
            rewrite: 'rewriteShowContainer'
        },
        'assign/learn': 'showLearn',
        'assign/conference-questions': 'showConferenceQuestions',
        'assign/conference-resources': 'showConferenceResources',
        'assign/apply': 'showApply',
        'assign/assess': 'showAssess'
    },


    // route handlers
    rewriteShowContainer: function(token, args, route) {
        var assignTabBar = this.getAssignTabbar(),
            assignTabId = 'learn';

        if (assignTabBar) {
            assignTabId = assignTabBar.getActiveTab().getItemId();
        }

        return 'assign/' + assignTabId;
    },

    beforeShowContainer: function(action) {
        action.stop();
        this.redirectTo('assign/learn');
    },

    showLearn: function() {
        var assignCt = this.getAssignCt();
        
        this.doShowContainer();
        this.doHighlightTabbars();        

        assignCt.removeAll();
        assignCt.add(this.getLearnCt());
    },

    showConferenceQuestions: function() {
        var assignCt = this.getAssignCt();

        this.doShowContainer();
        this.doHighlightTabbars();
                
        assignCt.removeAll();
        assignCt.add(this.getQuestionsCt());
    },

    showConferenceResources: function() {
        var assignCt = this.getAssignCt();
                
        this.doShowContainer();
        this.doHighlightTabbars();

        assignCt.removeAll();
        assignCt.add(this.getResourcesCt());
    },

    showApply: function() {
        var assignCt = this.getAssignCt();

        this.doShowContainer();
        this.doHighlightTabbars();
        
        assignCt.removeAll();
        assignCt.add(this.getApplyCt());
    },

    showAssess: function() {
        var assignCt = this.getAssignCt();
        
        this.doShowContainer();
        this.doHighlightTabbars();

        assignCt.removeAll();
        assignCt.add(this.getAssessCt());
    },


    // event handlers
    onAssignTabChange: function(tabbar, value, oldValue){
        var me = this,
            itemId = tabbar.getActiveTab().getItemId();

        if(oldValue !== null){
            me.redirectTo('assign/' + itemId);
        }

    },
    
    
    // controller methods
    /**
     * @private
     * Called by each subsection route handler to ensure container is activated
     */
    doShowContainer: function() {
        var tabsCt = this.getTabsCt();
        
        tabsCt.removeAll();
        tabsCt.add(this.getAssignCt());
    },

    /**
     * @private
     * Called by each subsection route handler to highlight the proper tab in the teacher
     * tabbar and the assign tabbar
     */
    doHighlightTabbars: function(){
        var assignTabbar = this.getAssignTabbar(),
            teacherTabbar = this.getTeacherTabbar(),
            hash = window.location.hash,
            section = hash.substring(hash.indexOf('/') + 1, hash.length),
            teacherTab = teacherTabbar.down('#assign'),
            assignTab = assignTabbar.down('#'+ section);

        assignTabbar.setActiveTab(assignTab);
        teacherTabbar.setActiveTab(teacherTab); 
    }

});