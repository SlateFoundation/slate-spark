/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.Work', {
    extend: 'Ext.app.Controller',

    // requires: [ 'SparkClassroomTeacher.ComponentRef' ],

    // config: {
    //   lastTab: null
    // },

    views: [
        'work.Container',
        'work.learn.Main',
        // 'work.apply.Main',
        // 'work.assess.Main',
        // 'work.conference.Main'
    ],

    // stores: [
    //     'apply.Tasks'
    // ],

    refs: {
        tabsCt: 'spark-teacher-tabscontainer',
        workCt: {
            selector: 'spark-teacher-work-ct',
            autoCreate: true,

            xtype: 'spark-teacher-work-ct'
        },
      // sparkTeacherTabBar: 'spark-teacher-tabbar',
      // workTabBar: 'spark-work tabbar[tabType=mainTab]',
      // studentTabBar: 'spark-work tabbar[tabType=studentTab]',

      // learnCmp: {
        // selector: 'spark-teacher-work-learn',
        // autoCreate: true,

        // xtype: 'spark-teacher-work-learn'
      // },
      // conferenceCmp: {
        // selector: 'spark-teacher-work-conference',
        // autoCreate: true,

        // xtype: 'spark-teacher-work-conference'
      // },
      // applyCmp: {
        // selector: 'spark-teacher-work-apply',
        // autoCreate: true,

        // xtype: 'spark-teacher-work-apply'
      // },
      // assessCmp: {
        // selector: 'spark-teacher-work-assess',
        // autoCreate: true,

        // xtype: 'spark-teacher-work-assess'
      // }
    },

    control: {
      // workTabBar: {
        //   activetabchange: 'onTabChange'
      // }
    },

    routes: {
        'work': {
            before: 'beforeShowContainer'
        },
        'work/learn': 'showLearn',
        'work/conference': 'showConference',
        'work/apply': 'showApply',
        'work/asses': 'showAsses'

      // 'work/:studentId/:view': {
        // action: 'routeWithStudentSubView'
      // }
    },


    // route handlers
    beforeShowContainer: function(action) {
        action.stop();
        this.redirectTo('work/learn');
    },

    showLearn: function() {
        this.doShowContainer();
        
        // TODO: show subsection, maybe via params to doShowContainer
    },

    showConference: function() {
        this.doShowContainer();
        
        // TODO: show subsection
    },

    showApply: function() {
        this.doShowContainer();
        
        // TODO: show subsection
    },

    showAssess: function() {
        this.doShowContainer();
        
        // TODO: show subsection
    },


    // event handlers
    
    
    
    // controller methods
    /**
     * @private
     * Called by each subsection route handler to ensure container is activated
     */
    doShowContainer: function() {
        var tabsCt = this.getTabsCt();
        
        tabsCt.removeAll();
        tabsCt.add(this.getWorkCt());
    }



    // TODO: remove following code as its functionality is refactored

    // // if route comes through without a sub view select the first sub view - 'learn'
    // // example: #work instead of #work/learn
    // rerouteBase: function(){
    //   var me = this,
    //       workCmp = me.getWorkCmp();

    //   //if the main work view isn't added to the viewport then add it
    //   if( Ext.Viewport.down( 'spark-teacher-work' ) == null ){
    //     Ext.Viewport.add( workCmp );
    //     me.redirectTo('work/learn');
    //   } else {
    //       var currentHash = window.location.hash;
    //       var currentSubView = me.getWorkTabBar().getActiveTab();

    //       if(currentSubView !== null){
    //         window.location.hash = currentHash + '/' + currentSubView.section;
    //       } else {
    //         window.location.hash = currentHash + '/learn';
    //       }
    //   }

    // },

    // // handles route that contains a subview - ex: #work/learn
    // routeWithSubView: function( view ){
    //   var me = this,
    //       workCmp = me.getWorkCmp();

    //   //if the main work view isn't added to the viewport then add it
    //   if( Ext.Viewport.down( 'spark-teacher-work' ) == null ){
    //     Ext.Viewport.add( workCmp );
    //   }

    //   //highlight active tabs based on passed in route
    //   var workTabBar = me.getWorkTabBar(),
    //       workTab = workTabBar.down('[section='+ view +']'),
    //       sectionTabBar = me.getSparkTeacherTabBar(),
    //       sectionTab = sectionTabBar.down('[section=work]');

    //   sectionTabBar.setActiveTab( sectionTab );
    //   workTabBar.setActiveTab( workTab );

    //   //segment showing of subview logic into a separate function
    //   me.showView( view );

    // },

    // routeWithStudentSubView: function( studentId, view ){
    //   var me = this,
    //       workCmp = me.getWorkCmp();

    //   //if the main work view isn't added to the viewport then add it
    //   if( Ext.Viewport.down( 'spark-teacher-work' ) == null ){
    //     Ext.Viewport.add( workCmp );
    //   }

    //   //highlight active tabs based on passed in route
    //   var workTabBar = me.getWorkTabBar(),
    //       workTab = workTabBar.down('[section='+ view +']'),
    //       sectionTabBar = me.getSparkTeacherTabBar(),
    //       sectionTab = sectionTabBar.down('[section=work]'),
    //       studentTabBar = me.getStudentTabBar(),
    //       studentTab = studentTabBar.down('[student_id='+ studentId +']');

    //   sectionTabBar.setActiveTab( sectionTab );
    //   workTabBar.setActiveTab( workTab );
    //   studentTabBar.setActiveTab( studentTab );

    //   //segment showing of subview logic into a separate function
    //   me.showView( view );

    // },

    // onTabChange: function( tabBar, newTab, oldTab ){
    //   var me = this;

    //   // set lastTab config property to last selected section
    //   if( oldTab !== null){
    //     me.config.lastTab = oldTab.config.section;
    //   }

    //   //route app to include new selected subview
    //   me.redirectTo( 'work/' + newTab.config.section );
    // },

    // //handles showing of subview based on selected tabbar option
    // showView: function ( view ){
    //   var me = this,
    //       targetContainer = SparkClassroomTeacher.ComponentRef.get( me, view ),
    //       workCmp = me.getWorkCmp();;

    //   //hide currently visible container if one exists
    //   if( me.config.lastTab !== null ){
    //     var oldTargetContainer = SparkClassroomTeacher.ComponentRef.get( me, me.config.lastTab );
    //     oldTargetContainer.hide();
    //   }

    //   // check if view has already been added to the viewport
    //   if( Ext.Viewport.down( 'spark-teacher-work-' + view) ){
    //     targetContainer.show();
    //   } else {
    //     workCmp.add( targetContainer );
    //   }

    // }
});