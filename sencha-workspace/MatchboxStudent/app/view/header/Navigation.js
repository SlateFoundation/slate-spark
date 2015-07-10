/**
 * This class is the navigation header for the application.
 */
Ext.define('MatchbookStudent.view.header.Navigation', {
    extend: 'Ext.view.View',
    xtype: 'header-navigation',

    requires: [
        'MatchbookStudent.store.NavigationItems'
    ],

    flex: 1,

    store: 'NavigationItems',
    itemSelector: 'a',

    //TODO : replace inline styles with css classes/SASS
    tpl: [
        '<ul style="float: left; width: 100%; padding: 0; margin: 0; list-style-type: none">',
            '<tpl for=".">',
                '<li style="display: inline">',
                    '<a style="display:block;text-align:center;float:left;width:25%;text-decoration:none;color:white;background-color:grey;border-right:1px solid white;padding:2px 0">',
                        '<span>{linkText}</span>',
                        '<span style="display:inline-block;float:right;border-left:1px solid white;padding:0 8px">{timeDisplay}</span>',
                    '</a>',
                '</li>',
            '</tpl>',
        '</ul>'
    ]

});
