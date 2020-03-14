/*jslint browser: true, undef: true, laxcomma:true, unused: true *//*global Ext*/
Ext.define('SparkClassroom.controller.analytics.TrackJS', {
    extend: 'Ext.app.Controller',


    listen: {
        socket: {
            connect: function(socket) {
                window.trackJs && window.trackJs.console.info('socket connected');
            },
            disconnect: function(socket) {
                window.trackJs && window.trackJs.console.info('socket disconnected');
            },
            reconnect: function(socket) {
                window.trackJs && window.trackJs.console.info('socket reconnect');
            },
            data: function(socket, data) {
                window.trackJs && window.trackJs.console.debug('socket data', Ext.encode(data));
            },
            emit: function(socket, event, data) {
                window.trackJs && window.trackJs.console.debug('socket emit', event, Ext.encode(data));
            }
        }
    },

    control: {
        'button': {
            tap: 'onButtonTap'
        }
    },


    // controller template methods
    init: function() {
        var trackJs = window.trackJs;

        if (trackJs) {
            Ext.util.History.on('change', function(token) {
                trackJs.console.info('navigate', '#' + token);
            });
        }
    },


    // event handlers
    onButtonTap: function(btn) {
        if (window.trackJs) {
            window.trackJs.console.info('click', btn.getText());
        }
    }
});