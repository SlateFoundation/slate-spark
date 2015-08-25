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
        assignTabBar: 'spark-teacher-assign-tabbar',
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
      assignTabBar: {
          activetabchange: 'onAssignTabChange'
      }
    },

    routes: {
        'assign': {
            before: 'beforeShowContainer'
        },
        'assign/learn': 'showLearn',
        'assign/conference-questions': 'showConferenceQuestions',
        'assign/conference-resources': 'showConferenceResources',
        'assign/apply': 'showApply',
        'assign/assess': 'showAssess'
    },


    // route handlers
    beforeShowContainer: function(action) {
        action.stop();
        this.redirectTo('assign/learn');
    },

    showLearn: function() {
        this.doShowContainer();
        this.doShowLearnContainer();
    },

    showConferenceQuestions: function() {
        this.doShowContainer();
        this.doShowConferenceQuestionsContainer();
    },

    showConferenceResources: function() {
        this.doShowContainer();
        this.doShowConferenceResourcesContainer();
    },

    showApply: function() {
        this.doShowContainer();
        this.doShowApplyContainer();
    },

    showAssess: function() {
        this.doShowContainer();
        this.doShowAssessContainer();
    },


    // event handlers
    onAssignTabChange: function(tabbar){
        var me = this,
            section = tabbar.getActiveTab().section;

        switch(section){
            case 'learn':
                me.redirectTo('assign/learn');
                break;
            case 'questions':
                me.redirectTo('assign/conference-questions');
                break;
            case 'resources':
                me.redirectTo('assign/conference-resources');
                break;
            case 'apply':
                me.redirectTo('assign/apply');
                break;
            case 'assess':
                me.redirectTo('assign/assess');
                break;
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
     * Called by each showLearn() to add the learnCt to the assignCt
     */
    doShowLearnContainer: function(){
        var assignCt = this.getAssignCt();

        assignCt.removeAll();
        assignCt.add(this.getLearnCt());
    },

    /**
     * @private
     * Called by each showConferenceQuestions() to add the questionsCt to the assignCt
     */
    doShowConferenceQuestionsContainer: function(){
        var assignCt = this.getAssignCt();

        assignCt.removeAll();
        assignCt.add(this.getQuestionsCt());
    },

    /**
     * @private
     * Called by each showConferenceResources() to add the resourceCt to the assignCt
     */
    doShowConferenceResourcesContainer: function(){
        var assignCt = this.getAssignCt();

        assignCt.removeAll();
        assignCt.add(this.getResourcesCt());
    },

    /**
     * @private
     * Called by each showApply() to add the applyCt to the assignCt
     */
    doShowApplyContainer: function(){
        var assignCt = this.getAssignCt();

        assignCt.removeAll();
        assignCt.add(this.getApplyCt());
    },

    /**
     * @private
     * Called by each showAssess() to add the assessCt to the assignCt
     */
    doShowAssessContainer: function(){
        var assignCt = this.getAssignCt();

        assignCt.removeAll();
        assignCt.add(this.getAssessCt());
    }

});