/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.Activity', {
    extend: 'Ext.app.Controller',

    views: [
        'activity.Container',
        'ActivityList@SparkClassroom.activity'
    ],

    stores: ['Activities@SparkClassroom.store'],

    refs:{
        sparkStudentNavBar: 'spark-student-navbar button',
        sparkActivityCt: {
            selector: 'spark-activity',
            autoCreate: true,

            xtype: 'spark-activity',
            hidden: true
        }
    },

    control: {
        sparkStudentNavBar: {
            tap: 'onSparkNavBarButtonClick'
        }
    },

    // event handlers
    onSparkNavBarButtonClick: function(btn) {
        var btnId = btn.getItemId(),
            sparkActivityCt = this.getSparkActivityCt();

        console.log(btnId, sparkActivityCt, sparkActivityCt.isHidden())

        // TODO possible handle clicking anywhere else in the viewport to hide the panel
        if (btnId == 'activity' && sparkActivityCt.isHidden()) {

            console.log('showing it!!!')
            sparkActivityCt.showBy(btn, 'tr-tr?');
            
        } else {
            sparkActivityCt.hide();
        }
    },

});
