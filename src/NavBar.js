/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.NavBar', {
    extend: 'Ext.Toolbar',
    xtype: 'spark-navbar',

    config: {
        selectedButton: null,
        activeSubpanel: null,

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
    },

    updateActiveSubpanel: function(panel, oldPanel) {
        if (oldPanel) {
            oldPanel.hide();
        }

        if (panel) {
            panel.show();
        }
    },

    toggleSubpanel: function(panel, showByButton) {
        var me = this;

        if (panel === me.getActiveSubpanel()) {
            me.setActiveSubpanel(null);
            return;
        }

        panel.setVisibility(false);

        if (!panel.getParent()) {
            me.getParent().add(panel);
        }

        me.setActiveSubpanel(panel);
        panel.alignTo(showByButton, 'tr-br?');

        panel.setVisibility(true);
    },

    hideSubpanel: function(panel) {
        var me = this;

        if (panel === me.getActiveSubpanel()) {
            me.setActiveSubpanel(null);
            return;
        }

        panel.setVisibility(false);
    }
});