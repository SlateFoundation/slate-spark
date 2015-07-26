/*jslint browser: true, undef: true *//*global Ext*/
/**
 * Standards Navigation Panel, an extension of Ext Panel with a vbox layout containing a tree panel
 *
 * @cfg title="ContentAreas"
 */
Ext.define('SparkRepositoryManager.view.sparkpoints.standards.DocumentsTree', {
    extend: 'Ext.tree.Panel',
    xtype: 'srm-sparkpoints-standarddocumentstree',

    title: 'Standards Documents',
    scrollable: true,

    store: 'Jurisdictions',

    rootVisible: false,
    useArrows: true,
    singleExpand: true,

/*
    viewConfig: {
        toggleOnDblClick: false
    },
*/

    columns: [{
        text: 'Jurisdiction',
        xtype: 'treecolumn',
        flex: 7,
        dataIndex: 'title'
    },{
        text: 'X',
        flex: 1,
        align: 'right',
        dataIndex: 'Total'
    },{
        text: 'O',
        flex: 1,
        align: 'right',
        dataIndex: 'Total2'
    }]
});
