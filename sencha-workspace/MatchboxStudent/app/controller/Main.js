/* global console */
/**
 * This class is the main controller.
 */
Ext.define('MatchbookStudent.controller.Main', {
    extend: 'Ext.app.Controller',

    views: [
        'MatchbookStudent.view.Main',
        'MatchbookStudent.view.header.Main',
        'MatchbookStudent.view.help.Window',
        'MatchbookStudent.view.help.Form',
        'MatchbookStudent.view.help.WaitList'
    ],

    refs: [{
        ref: 'help',
        selector: 'help-window',
        xtype: 'help-window',
        autoCreate: true
    }],

    init: function() {
        var me = this;

        me.control({
            'main': {
                render: me.renderHelpWindow
            },
            'header-main button[action="help"]': {
                toggle: me.onHelpButtonToggle
            }
        });
    },

    renderHelpWindow: function() {
        var help = this.getHelp();

        help.showAt([-1000,-1000]);

        Ext.Function.defer(function(){
            help.hide()
        }, 100);
    },

    onHelpButtonToggle: function(button, pressed) {
        var help = this.getHelp(),
            buttonX = button.getX(),
            buttonY = button.getY(),
            x,y;

        console.log(help);
        //if (help && help.getWidth) console.log(help.getWidth());

        x = buttonX-help.getWidth()+button.getWidth();
        y = buttonY+button.getHeight();


        if (pressed) {
            help.showAt(x,y);
//        help.setVisible(pressed);
        } else {
            help.hide();
        }

    }
});
