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


    views: [
        'assign.Container',
        'assign.learns.Container',
        'assign.questions.Container',
        'assign.resources.Container',
        'assign.apply.Container',
        'assign.assess.Container'
    ],

    stores: [
        'assign.ConferenceQuestions',
        'assign.ConferenceResources',
        'assign.Applies',
        'assign.Assessments'
    ],

    refs:{
        appCt: 'spark-teacher-appct',
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
            selector: 'spark-teacher-assign-learns',
            autoCreate: true,

            xtype: 'spark-teacher-assign-learns'
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
        appCt: {
            selectedsectionchange: 'onSelectedSectionChange',
            selectedstudentsparkpointchange: 'onSelectedStudentSparkpointChange'
        },
        assignNavButton: {
            tap: 'onNavAssignTap'
        },
        assignCt: {
            activate: 'onAssignCtActivate',
            selectedsparkpointchange: 'onSelectedSparkpointChange',
            deactivate: 'onAssignCtDeactivate'
        },
        sparkpointField: {
            sparkpointselect: 'onSparkpointFieldSparkpointSelect'
        },
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
            assignTabId, activeAssignTab, selectedStudentSparkpoint;

        if (
            assignTabBar
            && (activeAssignTab = assignTabBar.getActiveTab())
        ) {
            assignTabId = activeAssignTab.getItemId();
        } else if (selectedStudentSparkpoint = this.getAppCt().getSelectedStudentSparkpoint()) {
            assignTabId = selectedStudentSparkpoint.get('active_phase');

            if (assignTabId == 'conference') {
                assignTabId = 'conference-questions';
            }
        }

        return 'assign/' + (assignTabId || 'learn');
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


    // event handlers
    onSelectedSectionChange: function(appCt, selectedSection, oldSelectedSection) {
        // TODO: apply filters to stores
    },

    onSelectedStudentSparkpointChange: function(appCt, selectedStudentSparkpoint) {
        this.hideOverlays();
        this.syncSelectedStudentSparkpoint();
    },

    onNavAssignTap: function() {
        this.redirectTo('assign');
    },

    onAssignCtActivate: function() {
        var me = this;

        me.getNavBar().setSelectedButton(me.getAssignNavButton());

        me.syncSelectedStudentSparkpoint();
    },

    onSelectedSparkpointChange: function(assignCt, selectedSparkpoint) {
        this.getSparkpointField().setValue(selectedSparkpoint);
    },

    onAssignCtDeactivate: function() {
        this.hideOverlays();
    },

    onSparkpointFieldSparkpointSelect: function(sparkpointField, sparkpoint) {
        // don't do anything else here, use onSelectedSparkpointChange instead
        this.getAssignCt().setSelectedSparkpoint(sparkpoint.getId());
    },

    onAssignTabChange: function(tabbar, value, oldValue) {
        var me = this,
            itemId = tabbar.getActiveTab().getItemId();

        me.hideOverlays();

        if (oldValue !== null) {
            me.redirectTo(['assign', itemId]);
        }
    },


    // controller methods
    /**
     * @private
     * Called by each subsection route handler to ensure container is activated
     */
    doShowContainer: function() {
        var tabsCt = this.getTabsCt(),
            assignCt = this.getAssignCt();

        if (!assignCt.isPainted()) {
            tabsCt.removeAll();
            tabsCt.add(assignCt);
        }
    },

    /**
     * @private
     * Called by each subsection route handler to highlight the proper tab in the teacher
     * tabbar and the assign tabbar
     */
    doHighlightTabbars: function(section) {
        var assignTabbar = this.getAssignTabbar(),
            teacherTabbar = this.getTeacherTabbar(),
            teacherTab = teacherTabbar.down('#assign'),
            assignTab = assignTabbar.down('#'+ section);

        assignTabbar.setActiveTab(assignTab);
        teacherTabbar.setActiveTab(teacherTab);
    },

    syncSelectedStudentSparkpoint: function() {
        var me = this,
            selectedStudentSparkpoint = me.getAppCt().getSelectedStudentSparkpoint(),
            assignCt = me.getAssignCt(),
            sparkpointField = me.getSparkpointField();

        if (assignCt) {
            assignCt.setSelectedSparkpoint(selectedStudentSparkpoint ? selectedStudentSparkpoint.get('sparkpoint') : null);
        }

        sparkpointField.updateSelectedStudent(selectedStudentSparkpoint ? selectedStudentSparkpoint.get('student_id') : null);
    },

    /**
     * @private
     * Kind of hacky, called belligerently whenever something happens that should "wipe" the assignCt
     * clear of any overlaid elements
     */
    hideOverlays: function() {
        var columns = this.getAssignCt().query('spark-column-assignments'),
            columnsLength = columns.length,
            i = 0;

        for (; i < columnsLength; i++) {
            columns[i].setPopupCell(null);
        }
    }
});