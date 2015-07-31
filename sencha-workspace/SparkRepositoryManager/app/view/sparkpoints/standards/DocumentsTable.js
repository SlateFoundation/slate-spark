/*jslint browser: true, undef: true *//*global Ext*/
/**
 * Standards Navigation Panel, an extension of Ext Panel with a vbox layout containing a tree panel
 *
 * @cfg title="ContentAreas"
 */
Ext.define('SparkRepositoryManager.view.sparkpoints.standards.DocumentsTable', {
    extend: 'Ext.grid.Panel',
    xtype: 'srm-sparkpoints-documentstable',

    title: 'Standards Documents',
    scrollable: true,

    store: 'StandardDocuments',

    rootVisible: false,
    useArrows: true,
    singleExpand: true,

/*
    viewConfig: {
        toggleOnDblClick: false
    },
*/

    columns: [{
        flex: 4,

        text: 'Subject',
        dataIndex: 'subject'
    },{
        flex: 7,

        text: 'Document',
        dataIndex: 'name'
    },{
        flex: 3,

        text: 'Body',
        dataIndex: 'jurisdiction'
    },{
        flex: 3,

        text: 'Grades',
        dataIndex: 'grades'
    }]
});
