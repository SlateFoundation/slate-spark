/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.Help', {
    extend: 'Ext.app.Controller',
    
    views: [
        'help.Container'
    ],

    stores: [
        'Sections@SparkClassroom.store',
        'HelpRequests@SparkClassroom.store'
    ],
    
    models: [
        'HelpRequest@SparkClassroom.model'
    ],

    //stores: ['Students@SparkClassroom.store'],

    refs: {
        navBar: 'spark-student-navbar',
        helpNavButton: 'spark-student-navbar button#help',
        sectionSelect: 'spark-titlebar #sectionSelect',

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
        },
        'button[action=submit-helprequest]': {
            tap: 'onSubmitHelpRequestTap'
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
        var helpStore = Ext.getStore('HelpRequests');

        if (!helpStore.isLoaded()) {
            helpStore.load();
        }

        this.getNavBar().toggleSubpanel(this.getHelpCt(), btn);
    },

    onSubmitHelpRequestTap: function(btn) {
        var me = this,
            helpCt = me.getHelpCt(),
            radioField = helpCt.down('fieldset radiofield'),
            sectionStore = Ext.getStore('Sections'),
            sectionID = sectionStore.findRecord('Code', me.getSectionSelect().getValue()).get('ID'),
            requestType = radioField.getGroupValue(),
            helpRequest;

         helpRequest = me.getHelpRequestModel().create({
            Type: requestType,
            SectionID: sectionID
         });

         if (helpRequest.isValid()) {
             helpRequest.save({
                 success: function() {
                     Ext.toast('Save Successful');
                 }
             });
         }
    },

    // didn't bother programatically added radiofields because the styling is buggy
    // onSparkHelpContainerPainted: function(){
    //     //var helpForm = this.getHelpForm();
    // },

});