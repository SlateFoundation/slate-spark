/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.assign.Assign', {
    extend: 'Ext.app.Controller',

    requires: [ 'SparkClassroomTeacher.ComponentRef' ],

    config: {
        lastTab: null
    },

    views: [
        'assign.points.learn.Main',
        'assign.points.conference.ResourceGrid',
        'assign.points.conference.QuestionGrid',
        'assign.points.apply.Main',
        'assign.points.assess.Grid'
    ],

    stores: [
        'assign.Learn',
        'assign.Questions',
        'assign.Resources',
        'assign.Apply',
        'assign.Assess'
    ],

    refs:{
        sparkTabBar: 'spark-tabbar',
        assignTabBar:'spark-assign-points-tabbar',
        assignCmp: {
            selector: 'spark-assign-points',
            autoCreate: true,
            itemId: 'spark-assign',
            xtype: 'spark-assign-points'
        },
        learnCmp: {
            selector: 'spark-assign-points-learn',
            autoCreate: true,

            xtype: 'spark-assign-points-learn'
        },
        resourcesCmp: {
            selector: 'spark-assign-points-resources',
            autoCreate: true,

            xtype: 'spark-assign-points-resources'
        },
        questionsCmp: {
            selector: 'spark-assign-points-questions',
            autoCreate: true,

            xtype: 'spark-assign-points-questions'
        },
        applyCmp: {
            selector: 'spark-assign-points-apply',
            autoCreate: true,

            xtype: 'spark-assign-points-apply'
        },
        assessCmp: {
            selector: 'spark-assign-points-assess',
            autoCreate: true,

            xtype: 'spark-assign-points-assess'
        }
    },

    control: {
      assignTabBar: {
          activetabchange: 'onTabChange'
      }
    },

    routes: {
      'assign': {
        action: 'rerouteBase'
      },
      'assign/:view': {
        action: 'routeWithSubView'
      }
    },

    // if route comes through without a sub view select the first sub view - 'learn'
    // example: #assign instead of #assign/learn
    rerouteBase: function(){
      var me = this,
          assignCmp = me.getAssignCmp();

      //if the main work view isn't added to the viewport then add it
      if( Ext.Viewport.down( 'spark-teacher-work' ) == null ){
        Ext.Viewport.add( workCmp );
      }
      
      me.redirectTo('assign/learn');
    },

    // handles route that contains a subview - ex: #assign/learn
    routeWithSubView: function( view ){
      var me = this,
          assignCmp = me.getAssignCmp();

      //if the main work view isn't added to the viewport then add it
      if( Ext.Viewport.down( 'spark-assign-points' ) == null ){
        Ext.Viewport.add( assignCmp );
      }

      //highlight active tabs based on passed in route
      var workTabBar = me.getAssignTabBar(),
          workTab = workTabBar.down('[section='+ view +']'),
          sectionTabBar = me.getSparkTabBar(),
          sectionTab = sectionTabBar.down('[section=assign]');

      sectionTabBar.setActiveTab( sectionTab );
      workTabBar.setActiveTab( workTab );

      //segment showing of subview logic into a separate function
      me.showView( view );

    },

    onTabChange: function( tabBar, newTab, oldTab ){
      var me = this;

      // set lastTab config property to last selected section
      if( oldTab !== null){
        me.config.lastTab = oldTab.config.section;
      }

      //route app to include new selected subview
      me.redirectTo( 'assign/' + newTab.config.section );
    },
    //handles showing of subview based on selected tabbar option
    showView: function ( view ){
      var me = this,
          targetContainer = SparkClassroomTeacher.ComponentRef.get( me, view ),
          assignCmp = me.getAssignCmp();

      //hide currently visible container if one exists
      if( me.config.lastTab !== null ){
        var oldTargetContainer = SparkClassroomTeacher.ComponentRef.get( me, me.config.lastTab );
        oldTargetContainer.hide();
      }

      // check if view has already been added to the viewport
      if( Ext.Viewport.down( 'spark-assign-points-' + view) ){
        targetContainer.show();
      } else {
        assignCmp.add( targetContainer );
      }

    }


    // applyActiveTab: function(tab) {
    //     var me = this,
    //         section;
    //
    //     if (Ext.isString(tab)) {
    //         section = tab;
    //     } else if (tab.isXtype('button')) {
    //         section = tab.config.section;
    //     }
    //
    //     switch(section) {
    //         case 'learn':
    //             tab = me.getLearnCt();
    //             break;
    //         case 'resourcegrid':
    //             tab = me.getConferenceResourceGrid();
    //             break;
    //         case 'questiongrid':
    //             tab = me.getConferenceQuestionGrid();
    //             break;
    //         case 'apply':
    //             tab = me.getApplyCt();
    //             break;
    //         case 'assess':
    //             tab = me.getAssessGrid();
    //             break;
    //     }
    //
    //     return tab;
    // },
    //
    // updateActiveTab: function(newTab, oldTab) {
    //     //initial load contains no tab
    //     if (oldTab) {
    //         oldTab.hide();
    //     }
    //
    //     if(Ext.Viewport.down(newTab)) {
    //         newTab.show();
    //     } else {
    //         Ext.Viewport.add(newTab);
    //     }
    // },
    //
    // onLearnCtShow: function () {
    //     this.redirectTo('assign/learn');
    // },
    //
    // onConferenceResourceGridShow: function () {
    //     this.redirectTo('assign/resourcegrid');
    // },
    //
    // onConferenceQuestionGridShow: function () {
    //     this.redirectTo('assign/questiongrid');
    // },
    //
    // onApplyCtShow: function () {
    //     this.redirectTo('assign/apply');
    // },
    //
    // onAssessCtShow: function () {
    //     this.redirectTo('assign/learn');
    // },
    //
    // onViewSelected: function(section) {
    //     var tabBar = this.getPointsTabbar();
    //
    //     tabBar.setActiveTab(tabBar.down('[section='+section+']'));
    // },
    //
    // onTabChange: function(tabBar, newTab, oldTab) {
    //     this.setActiveTab(newTab.config.section);
    // },
    //
    // onAssignPointsActivate: function (tabBar) {
    //     var tab = this.getActiveTab();
    //
    //     if (tab) {
    //         tab.show();
    //     } else {
    //         this.redirectTo('assign');
    //     }
    // },
    //
    // onSectionClose: function (tab) {
    //     var tab = this.getActiveTab();
    //
    //     if (tab) {
    //         tab.hide();
    //     }
    // }
});
