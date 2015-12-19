/*jslint browser: true, undef: true, laxcomma:true, unused: true *//*global Ext*/
Ext.define('SparkClassroom.controller.analytics.Clicky', {
    extend: 'Ext.app.Controller',


    control: {
        'button': {
            tap: 'onButtonTap'
        }
    },


    // event handlers
    onButtonTap: function(btn) {
        if (window.clicky) {
            window.clicky.log('#' + Ext.util.History.getToken(), btn.getText(), 'click');
        }
    }
});