Ext.define('SparkClassroomStudent.controller.Help', {
    extend: 'Ext.app.Controller',


    // entry points
    listen: {
        store: {
            '#Students': {
                load: 'onStudentsLoad'
            },
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
        appCt: 'spark-student-appct',

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


    // config handlers
    updateStudentSparkpoint: function() {
        this.syncHelpRequests();
    },


    // event handlers
    onStudentsLoad: function() {
        this.getHelpRequestsStore().load();
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

        var me = this, // eslint-disable-line vars-on-top
            studentSparkpoint = me.getAppCt().getLoadedStudentSparkpoint(),
            itemData = data.item,
            helpStore, doLoadHelpRequest;

        if (!studentSparkpoint || studentSparkpoint.get('section_id') != itemData.section_id) {
            return;
        }

        helpStore = me.getHelpRequestsStore();

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
        this.getNavBar().toggleSubpanel(this.getHelpCt(), btn);
    },

    onRequestTypeChange: function(requestTypeField) {
        this.getSubmitButton().setDisabled(!requestTypeField.getGroupValue());
    },

    onSubmitHelpRequestTap: function() {
        var me = this;

        me.getHelpRequestsStore().add({
            'request_type': me.getFirstHelpRadio().getGroupValue(),
            'student_id': me.getAppCt().getLoadedStudentSparkpoint().get('student_id')
        });

        me.getHelpCt().down('radiofield{isChecked()}').setChecked(false);
    },

    onDeleteTap: function(list, item) {
        item.getRecord().set('close', true);
    },


    // controller methods
    syncHelpRequests: function() {
        var studentSparkpoint = this.getAppCt().getLoadedStudentSparkpoint(),
            studentId = studentSparkpoint && studentSparkpoint.get('student_id'), // studentSparkpoint might not be loaded yet
            helpRequests = this.getHelpRequestsStore().getRange(),
            helpRequestsLength = helpRequests.length,
            i = 0, helpRequest;

        if (!studentId) {
            return;
        }

        for (; i < helpRequestsLength; i++) {
            helpRequest = helpRequests[i];
            helpRequest.set('can_close', studentId == helpRequest.get('student_id'));
        }
    }
});