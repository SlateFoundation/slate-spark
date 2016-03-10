/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.Priorities', {
    extend: 'Ext.app.Controller',


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

    // controller config
    stores: [
        'gps.Priorities'
    ],


    // event handlers
    onStudentsLoad: function() {
        Ext.getStore('gps.Priorities').load();
    },

    onSocketData: function(socket, data) {

    }
});