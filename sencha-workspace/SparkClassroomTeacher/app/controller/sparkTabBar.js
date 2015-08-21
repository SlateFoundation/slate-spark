/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.sparkTabBar', {
    extend: 'Ext.app.Controller',

    config: {
        lastTab: null
    },

    requires: [ 'SparkClassroomTeacher.ComponentRef' ],

    views: [
        'assign.points.TabBar',
        'assign.points.Main',
        'competencies.Main',
        'work.Main'
    ],

    refs:{
        workCmp: {
            selector: 'spark-teacher-work',
            autoCreate: true,
            itemId: 'spark-work',
            xtype: 'spark-teacher-work'
        },
        competenciesCmp: {
            selector: 'spark-competencies',
            autoCreate: true,
            itemId: 'spark-competencies',
            xtype: 'spark-competencies'
        },
        assignCmp: {
            selector: 'spark-assign-points',
            autoCreate: true,
            itemId: 'spark-assign',
            xtype: 'spark-assign-points'
        },
        sparkTabBar: 'viewport spark-tabbar'
    },

    control: {
        'viewport spark-tabbar': {
            activetabchange: 'onTabChange'
        }
    },

    onTabChange: function( tabBar, newTab, oldTab ){
        var me = this,
        targetContainer = SparkClassroomTeacher.ComponentRef.get( me, newTab.config.section );

        // set lastTab config property to last selected section
        if( oldTab !== null){
          me.config.lastTab = oldTab.config.section;
        }

        //hide currently visible container if one exists
        if( me.config.lastTab !== null ){
          var oldTargetContainer = SparkClassroomTeacher.ComponentRef.get( me, me.config.lastTab );
          Ext.Viewport.remove( oldTargetContainer, false );
        }

        //add new container to the dom
        Ext.Viewport.add( targetContainer )

        // add section hash to url to trigger controller route
        me.redirectTo( newTab.config.section );

    },

    /*
      Depending on how the sub view is added it may not show up as a lastTab in the
      'onTabChange' function and will not be hidden.  This logic finds any visible refs
      and hides them.
    */
    hideAllFound: function(){
      var refs = this._refs;

      // loop through all controller refs to see if any are visible, hide them if found
      for( var i = 0; i < refs.length; i++ ){
        var targetView = Ext.Viewport.down( refs[i].selector );

        if( targetView !== null ){
          targetView.hide();
        }
      }

    }

});
