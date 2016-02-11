/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.Help', {
    extend: 'Ext.app.Controller',


    // custom configs
    config: {
        studentSparkpoint: null,
        activeSection: null
    },


    // entry points
    listen: {
        controller: {
            '#': {
                sectionselect: 'onSectionSelect'
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
        waitlist: 'spark-waitlist'
    },


    // config handlers
    updateActiveSection: function() {
        var helpStore = Ext.getStore('HelpRequests');

        if (!helpStore.isLoaded()) {
            helpStore.load();
        }
    },


    // event handlers
    onSectionSelect: function(section) {
        this.setActiveSection(section);
    },

    onSocketData: function(socket, data) {
        if (data.table != 'help_requests') {
            return;
        }

        var me = this,
            itemData = data.item,
            helpStore, doLoadHelpRequest;

        if (me.getActiveSection() != itemData.section_code) {
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