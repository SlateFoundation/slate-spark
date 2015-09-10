/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.Activity', {
    extend: 'Ext.app.Controller',

    views: [
        'activity.Container',
        'ActivityList@SparkClassroom.activity'
    ],

    stores: ['Activities@SparkClassroom.store'],

    refs:{
        sparkNavBarButton: 'spark-navbar button',
        sparkActivityCt: {
            selector: 'spark-activity',
            autoCreate: true,

            xtype: 'spark-activity',
            hidden: true
        }
    },

    control: {
        sparkNavBarButton: {
            tap: 'onSparkNavBarButtonClick'
        }
    },

    // event handlers
    onSparkNavBarButtonClick: function(btn) {
        var btnId = btn.getItemId(),
            sparkActivityCt = this.getSparkActivityCt();


        // TODO possible handle clicking anywhere else in the viewport to hide the panel
        if (btnId == 'activity' && sparkActivityCt.isHidden()) {

            sparkActivityCt.showBy(btn, 'tr-tr?');
            
        } else {
            sparkActivityCt.hide();
        }
    },

});
