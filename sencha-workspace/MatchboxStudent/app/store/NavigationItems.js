/**
 * This store contains the navigation items
 */
Ext.define('MatchbookStudent.store.NavigationItems', {
    extend: 'Ext.data.Store',
    storeId: 'NavigationItems',

    fields: [
        {name: 'linkText', type: 'string'},
        {name: 'timeDisplay', type: 'string'},
        {name: 'enabled', type: 'boolean', defaultValue: false}
    ],

    data: [
        {
            linkText: 'Learn & Practice',
            path: 'learn',
            timeDisplay: '2h'
        },{
            linkText: 'Conference',
            path: 'conference',
            timeDisplay: '1.5h'
        },{
            linkText: 'Apply',
            path: 'apply',
            timeDisplay: '30m'
        },{
            linkText: 'Assess',
            path: 'assess'
        }
    ]

});
