/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.Help', {
    extend: 'Ext.app.Controller',

    config: {
        studentSparkpoint: null
    },

    views: [
        'help.Container'
    ],

    stores: [
        'Sections@SparkClassroom.store',
        'HelpRequests@SparkClassroom.store'
    ],

    refs: {
        navBar: 'spark-student-navbar',
        helpNavButton: 'spark-student-navbar button#help',

        helpCt: {
            selector: 'spark-help',
            autoCreate: true,

            xtype: 'spark-help'
        },
        firstHelpRadio: 'spark-help radiofield',
        submitButton: 'spark-help button[action=submit-helprequest]'
        //helpForm: '#helpForm'
    },

    control: {
        helpNavButton: {
            tap: 'onNavHelpTap'
        },
        'spark-help radiofield[name=request]': {
            change: 'onRequestTypeChange'
        },
        submitButton: {
            tap: 'onSubmitHelpRequestTap'
        }
        // called on painted because the get return empty when the component is
        // autoCreated with hidden set to true
        // ,sparkHelpCt: {
        //     painted: 'onSparkHelpContainerPainted'
        // }
    },

    listen: {
        controller: {
            '#': {
                studentsparkpointload: 'onStudentSparkpointLoad',
            }
        }
    },

    // event handlers
    onStudentSparkpointLoad: function(studentSparkpoint) {
        this.setStudentSparkpoint(studentSparkpoint);
    },

    onNavHelpTap: function(btn) {
        var helpStore = Ext.getStore('HelpRequests');

        if (!helpStore.isLoaded()) {
            helpStore.load();
        }

        this.getNavBar().toggleSubpanel(this.getHelpCt(), btn);
    },

    onRequestTypeChange: function(requestTypeField) {
        this.getSubmitButton().setDisabled(!requestTypeField.getGroupValue());
    },

    onSubmitHelpRequestTap: function(btn) {
        var me = this;

         me.getHelpRequestsStore().add({
            request_type: me.getFirstHelpRadio().getGroupValue(),
            student_id: me.getStudentSparkpoint().get('student_id')
         });

         me.getHelpCt().down('radiofield{isChecked()}').setChecked(false);
    }

    // didn't bother programatically added radiofields because the styling is buggy
    // onSparkHelpContainerPainted: function(){
    //     //var helpForm = this.getHelpForm();
    // },
});