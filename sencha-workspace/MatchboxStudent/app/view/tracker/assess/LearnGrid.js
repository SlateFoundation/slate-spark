/**
 * This class is the grid panel of the learn page of the course tracker.
 */
Ext.define('MatchbookStudent.view.tracker.assess.LearnGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'tracker-assess-learngrid',

    requires: [
        'MatchbookStudent.store.Learns',
        'MatchbookStudent.view.tracker.assess.LearnGridController'
    ],

    stores: 'LearnRatings',

    controller: 'tracker-assess-learngridcontroller',

    selModel: 'cellmodel',
    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1
    },

    columns: [{
        text: 'Learns',
        dataIndex: 'Title',
        renderer: 'playlistColumnRenderer',
        flex: 1
    },{
        text: 'Rating',
        dataIndex: 'Rating',
        editor: {
            xtype: 'combobox',
            forceSelection: true,
            editable: false,
            triggerAction: 'all',
            store: [ 1,2,3,4,5 ]
        },
        flex: 1
    },{
        text: 'Comments',
        dataIndex: 'Comments',
        editor: 'textfield',
        flex: 1
    }]

});
