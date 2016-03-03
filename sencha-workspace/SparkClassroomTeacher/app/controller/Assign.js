/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
/**
 * The Assign controller handles activating the top-level
 * "Assign" tab and manages navigation between its immediate
 * subtabs for each content type
 *
 * ## Responsibilities
 * - Realize /assign and /assign/{contentType} routes
 * - Ensure "Assign" tab is selected in navbar and teacher tabs when
 * screen gets activated
 * - Instantiating and activating correct subsection for each subtab
 * on select
 */
Ext.define('SparkClassroomTeacher.controller.Assign', {
    extend: 'Ext.app.Controller',

    config: {
        selectedSection: null,
        activeStudent: null
    },

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
        navBar: 'spark-navbar',
        assignNavButton: 'spark-navbar button#assign',

        tabsCt: 'spark-teacher-tabscontainer',
        teacherTabbar: 'spark-teacher-tabbar',

        assignCt: {
            selector: 'spark-teacher-assign-ct',
            autoCreate: true,

            xtype: 'spark-teacher-assign-ct'
        },
        sparkpointField: 'spark-teacher-assign-ct spark-sparkpointfield',
        assignTabbar: 'spark-teacher-assign-tabbar',

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
        assignNavButton: {
            tap: 'onNavAssignTap'
        },
        assignCt: {
            activate: 'onAssignCtActivate'
        },
        assignTabbar: {
            activetabchange: 'onAssignTabChange'
        }
    },

    listen: {
        controller: {
            '#': {
                sectionselect: 'onSectionSelect',
                activestudentselect: 'onActiveStudentSelect'
            }
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
        this.doHighlightTabbars('learn');

        assignCt.removeAll();
        assignCt.add(this.getLearnCt());
    },

    showConferenceQuestions: function() {
        var assignCt = this.getAssignCt();

        this.doShowContainer();
        this.doHighlightTabbars('conference-questions');

        assignCt.removeAll();
        assignCt.add(this.getQuestionsCt());
    },

    showConferenceResources: function() {
        var assignCt = this.getAssignCt();

        this.doShowContainer();
        this.doHighlightTabbars('conference-resources');

        assignCt.removeAll();
        assignCt.add(this.getResourcesCt());
    },

    showApply: function() {
        var assignCt = this.getAssignCt();

        this.doShowContainer();
        this.doHighlightTabbars('apply');

        assignCt.removeAll();
        assignCt.add(this.getApplyCt());
    },

    showAssess: function() {
        var assignCt = this.getAssignCt();

        this.doShowContainer();
        this.doHighlightTabbars('assess');

        assignCt.removeAll();
        assignCt.add(this.getAssessCt());
    },


    // config handlers
    updateSelectedSection: function(section) {
        // TODO: apply filters to stores
    },

    updateActiveStudent: function(activeStudent) {
        this.syncActiveStudent();
    },


    // event handlers
    onSectionSelect: function(section) {
        this.setSelectedSection(section);
    },

    onActiveStudentSelect: function(student) {
        this.setActiveStudent(student);
    },

    onNavAssignTap: function() {
        this.redirectTo('assign');
    },

    onAssignCtActivate: function() {
        var me = this;

        me.getNavBar().setSelectedButton(me.getAssignNavButton());

        me.syncActiveStudent();
    },

    onAssignTabChange: function(tabbar, value, oldValue){
        var me = this,
            itemId = tabbar.getActiveTab().getItemId();

        if(oldValue !== null){
            me.redirectTo(['assign', itemId]);
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
    doHighlightTabbars: function(section){
        var assignTabbar = this.getAssignTabbar(),
            teacherTabbar = this.getTeacherTabbar(),
            teacherTab = teacherTabbar.down('#assign'),
            assignTab = assignTabbar.down('#'+ section);

        assignTabbar.setActiveTab(assignTab);
        teacherTabbar.setActiveTab(teacherTab);
    },


    syncActiveStudent: function() {
        var me = this,
            activeStudent = me.getActiveStudent(),
            sparkpointField = me.getSparkpointField(),
            sparkpointSuggestionsStore = sparkpointField && sparkpointField.getSuggestionsList().getStore();

        if (!activeStudent || !sparkpointField) {
            return;
        }

        sparkpointField.setValue(activeStudent.get('sparkpoint'));
        sparkpointSuggestionsStore.getProxy().setExtraParam('student_id', activeStudent.getId());

        if (sparkpointSuggestionsStore.isLoaded()) {
            sparkpointSuggestionsStore.load();
        }
    }
});