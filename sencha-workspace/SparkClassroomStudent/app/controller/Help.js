/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.Help', {
    extend: 'Ext.app.Controller',

    views: [
        'help.Container',
        'help.Waitlist'
    ],

    stores: ['Students@SparkClassroom.store'],

    refs:{
        sparkStudentNavBar: 'spark-student-navbar button',
        sparkHelpCt: {
            selector: 'spark-help',
            autoCreate: true,

            xtype: 'spark-help',
            hidden: true
        },
        helpForm: '#helpForm'
    },

    control: {
        sparkStudentNavBar: {
            tap: 'onSparkNavBarButtonClick'
        }
        // called on painted because the get return empty when the component is 
        // autoCreated with hidden set to true
        // ,sparkHelpCt: {
        //     painted: 'onSparkHelpContainerPainted'
        // }
    },

    onLaunch: function(){
        var studentsStore = Ext.getStore('Students');

        // UNCOMMENT TO BREAK EVERYTHING!
        //studentsStore.load();
    },

    // event handlers
    onSparkNavBarButtonClick: function(btn) {
        var btnId = btn.getItemId(),
            sparkHelpCt = this.getSparkHelpCt();

        // TODO possible handle clicking anywhere else in the viewport to hide the panel
        if (btnId == 'help' && sparkHelpCt.isHidden()) {
            sparkHelpCt.showBy(btn, 'tr-tr?');
        } else {
            sparkHelpCt.hide();
        }
    },

    // didn't bother programatically added radiofields because the styling is buggy
    onSparkHelpContainerPainted: function(){
        //var helpForm = this.getHelpForm();
    },

});
