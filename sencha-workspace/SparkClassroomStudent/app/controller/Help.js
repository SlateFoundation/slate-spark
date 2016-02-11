/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.Help', {
    extend: 'Ext.app.Controller',


    // custom configs
    config: {
        studentSparkpoint: null,
        selectedSection: null
    },


    // entry points
    listen: {
        controller: {
            '#': {
                studentsparkpointload: 'onStudentSparkpointLoad',
                sectionselect: 'onSectionSelect'
            }
        },
        store: {
            '#HelpRequests': {
                add: 'onStoreAdd',
                load: 'onStoreLoad'
            }
        },
        socket: {
            data: 'onSocketData'
        }
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
        },
        waitlist: {
            deletetap: 'onDeleteTap'
        }
    },


    // controller config
    views: [
        'help.Container'
    ],

    stores: [
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
        submitButton: 'spark-help button[action=submit-helprequest]',
        waitlist: 'spark-waitlist'
    },


    // event handlers
    onStudentSparkpointLoad: function(studentSparkpoint) {
        this.setStudentSparkpoint(studentSparkpoint);
    },

    onSectionSelect: function(section) {
        this.getNavBar().hideSubpanel(this.getHelpCt());
    },

    onStoreAdd: function() {
        this.syncHelpRequests();
    },

    onStoreLoad: function() {
        this.syncHelpRequests();
    },

    onSocketData: function(socket, data) {
        if (data.table != 'help_requests') {
            return;
        }

        var me = this,
            studentSparkpoint = me.getStudentSparkpoint(),
            itemData = data.item,
            helpStore, doLoadHelpRequest;

        if (!studentSparkpoint || studentSparkpoint.get('section_id') != itemData.section_id) {
            return;
        }

        helpStore = Ext.getStore('HelpRequests');

        doLoadHelpRequest = function() {
            var helpRequest = helpStore.getById(itemData.id);

            if (helpRequest) {
                helpRequest.set(itemData, { dirty: false });
            } else {
                helpStore.add(itemData);
            }
        };

        if (helpStore.isSyncing) {
            helpStore.on('write', doLoadHelpRequest, me, { single: true });
        } else {
            doLoadHelpRequest();
        }
    },

    onNavHelpTap: function(btn) {
        var helpStore = Ext.getStore('HelpRequests');

        if (helpStore.isLoaded()) {
            helpStore.reload();
        } else {
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
    },

    onDeleteTap: function(list, item) {
        item.getRecord().set('close', true);
    },


    // controller methods
    syncHelpRequests: function() {
        var studentId = this.getStudentSparkpoint().get('student_id'),
            helpRequests = Ext.getStore('HelpRequests').getRange(),
            helpRequestsLength = helpRequests.length,
            i = 0, helpRequest;

        for (; i < helpRequestsLength; i++) {
            helpRequest = helpRequests[i];
            helpRequest.set('can_close', studentId == helpRequest.get('student_id'));
        }
    }
});