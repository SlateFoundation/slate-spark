/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.NavBar', {
    extend: 'Ext.Toolbar',
    xtype: 'spark-navbar',

    config: {
        selectedButton: null,

        cls: 'spark-navbar',
        layout: {
            type: 'hbox',
            pack: 'end'
        },
    },

    updateSelectedButton: function(newButton, oldButton) {
        if (oldButton) {
            oldButton.removeCls('is-selected');
        }

        if (newButton) {
            newButton.addCls('is-selected');
        }
    }
});