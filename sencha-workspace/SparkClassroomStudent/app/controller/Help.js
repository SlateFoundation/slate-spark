/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.Help', {
    extend: 'Ext.app.Controller',

    views: [
        'help.Container'
    ],

    //stores: ['Students@SparkClassroom.store'],

    refs: {
        navBar: 'spark-student-navbar',
        helpNavButton: 'spark-student-navbar button#help',

        helpCt: {
            selector: 'spark-help',
            autoCreate: true,

            xtype: 'spark-help'
        }
        //helpForm: '#helpForm'
    },

    control: {
        helpNavButton: {
            tap: 'onNavHelpTap'
        }
        // called on painted because the get return empty when the component is
        // autoCreated with hidden set to true
        // ,sparkHelpCt: {
        //     painted: 'onSparkHelpContainerPainted'
        // }
    },

    // onLaunch: function(){
    //     var studentsStore = Ext.getStore('Students');

    //     // UNCOMMENT TO BREAK EVERYTHING!
    //     //studentsStore.load();
    // },

    // event handlers
    onNavHelpTap: function(btn) {
        this.getNavBar().toggleSubpanel(this.getHelpCt(), btn);
    },

    // didn't bother programatically added radiofields because the styling is buggy
    // onSparkHelpContainerPainted: function(){
    //     //var helpForm = this.getHelpForm();
    // },

});