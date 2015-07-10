/**
 * This class is the popup window for the help button of the course tracker.
 */
Ext.define('MatchbookStudent.view.help.Window', {
    extend: 'Ext.window.Window',
    xtype: 'help-window',

    header: false,

    // Note: right now, width specification is required by show function but we can (and prob should) change this
    //height: 200,
    //width: 400,

    closeAction: 'hide',

    layout: 'fit',

    items: [{
        xtype: 'container',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'help-form',
            flex: 1
        },{
            xtype: 'help-waitlist',
            flex: 1
        }]
    }],

    initComponent: function() {
        this.callParent(arguments);
        Ext.util.Observable.capture(this, function(evname) {console.log(evname, arguments);});
        this.fireEvent('init',this);
    }

});
