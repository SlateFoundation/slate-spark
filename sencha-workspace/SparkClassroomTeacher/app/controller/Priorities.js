/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.Priorities', {
    extend: 'Ext.app.Controller',


    // custom configs
    config: {
        activeStudent: null,
        activeSection: null
    },

    // entry points
    listen: {
        controller: {
            '#': {
                sectionselect: 'onSectionSelect'
            }
        },
        store: {
            '#Students': {
                load: 'onStudentsLoad'
            }
        },
        socket: {
            data: 'onSocketData'
        }
    },

    // controller config
    stores: [
        'gps.Priorities'
    ],

    refs: {
        // waitlist: 'spark-waitlist'
    },


    // event handlers
    onSectionSelect: function(section) {
        //this.setActiveSection(section);
    },

    onStudentsLoad: function() {
        Ext.getStore('gps.Priorities').load();
    },

    onSocketData: function(socket, data) {

    }
});