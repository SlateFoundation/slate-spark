/**
 * This class is the grid panel of the learn page of the course tracker.
 */
Ext.define('MatchbookStudent.view.tracker.learn.Grid', {
    extend: 'Ext.grid.Panel',
    xtype: 'tracker-learn-grid',

    requires: [
        'MatchbookStudent.store.Learns',
        'MatchbookStudent.view.tracker.learn.GridController'
    ],

    stores: 'Learns',

    controller: 'tracker-learn-gridcontroller',

    columns: [{
        text: 'Completed',
        dataIndex: 'Completed',
        flex: 1
    },{
        text: 'Playlist',
        dataIndex: 'Title',
        renderer: 'playlistColumnRenderer',
        flex: 1
    },{
        text: 'Vendor',
        dataIndex: 'Vendor',
        flex: 1
    },{
        text: 'DOK',
        dataIndex: 'DOK',
        flex: 1
    },{
        text: 'Category',
        dataIndex: 'Category',
        flex: 1
    },{
        text: 'Avg Rating',
        flex: 1,
        dataIndex: 'Avg_Student_Rating'
/*
        columns: [{
            text: 'S',
            dataIndex: 'Avg_Student_Rating',
            flex: 1
        },{
            text: 'T',
            dataIndex: 'Avg_Teacher_Rating',
            flex: 1
        }]
*/
    },{
        text: 'Score',
        dataIndex: 'Score',
        flex: 1
    },{
        text: 'Attachment',
        flex: 1
    },{
        text: 'Issue',
        flex: 1
    }]

});
