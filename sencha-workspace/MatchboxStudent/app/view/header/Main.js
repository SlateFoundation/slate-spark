/**
 * This class is the main header for the application.
 */
Ext.define('MatchbookStudent.view.header.Main', {
    extend: 'Ext.container.Container',
    xtype: 'header-main',

    requires: [
    ],

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'combobox',
        emptyText: 'CourseName'
    },{
        xtype: 'combobox',
        emptyText: 'Select Standard/Unit'
    },{
        // spacer
        xtype: 'component',
        flex: 1
    },{
        xtype: 'container',
        data: {days: 3},
        tpl: '{days} days'
    },{
        xtype: 'button',
        text: 'Class GPS'
    },{
        xtype: 'button',
        action: 'help',
        enableToggle: true,
        text: 'Help'
    }]
});
