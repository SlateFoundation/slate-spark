/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.Help', {
    extend: 'Ext.app.Controller',

    config: {
        studentSparkpoint: null,
        activeSection: null
    },
/*
    views: [
        'help.Container'
    ],
*/
    stores: [
        'HelpRequests@SparkClassroom.store'
    ],

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

    refs: {
        waitlist: 'spark-waitlist'
    },

    control: {
        waitlist: {
            deletetap: 'onDeleteTap',
        }
    },

    onDeleteTap: function(list, item) {
        item.getRecord().set('close', true);
    },

    onSocketData: function(socket, data) {
        if (data.table != 'help_requests') {
            return;
        }

        var me = this,
            itemData = data.item,
            helpStore, doLoadHelpRequest;
        me.getActiveSection();

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
    }
});