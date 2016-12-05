Ext.define('SparkClassroomTeacher.controller.Help', {
    extend: 'Ext.app.Controller',


    // custom configs
    config: {
        studentSparkpoint: null
    },


    // entry points
    listen: {
        store: {
            '#Students': {
                load: 'onStudentsLoad'
            }
        },
        socket: {
            data: 'onSocketData'
        }
    },

    control: {
        waitlist: {
            deletetap: 'onDeleteTap'
        }
    },


    // controller config
    stores: [
        'HelpRequests@SparkClassroom.store'
    ],

    refs: {
        appCt: 'spark-teacher-appct',
        waitlist: 'spark-waitlist'
    },


    // event handlers
    onStudentsLoad: function() {
        Ext.getStore('HelpRequests').load();
    },

    onSocketData: function(socket, data) {
        if (data.table != 'help_requests') {
            return;
        }

        var me = this, // eslint-disable-line vars-on-top
            itemData = data.item,
            helpStore, doLoadHelpRequest;

        if (me.getAppCt().getSelectedSection() != itemData.section_code) {
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

    onDeleteTap: function(list, item) {
        item.getRecord().set('close', true);
    }
});