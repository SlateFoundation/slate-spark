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

    //store: 'StandardsCategories',
    store:{
        type: 'tree',
        root: {
            expanded: true,
            children: [
                { Title: 'Common Core', Total: 35, Total2: 3921, leaf: true },
                { Title: 'NJ State', Total: 21, Total2: 879, leaf: true },
                { Title: 'PA State', Total: 25, Total2: 126, leaf: true }
            ]
        }
    },

    rootVisible: false,
    useArrows: true,
    singleExpand: true,

/*
    viewConfig: {
        toggleOnDblClick: false
    },
*/

    columns: [{
        xtype: 'treecolumn',
        flex: 5,
        dataIndex: 'Title'
    },{
        text: 'X',
        flex: 2,
        align: 'right',
        dataIndex: 'Total'
    },{
        text: 'O',
        flex: 2,
        align: 'right',
        dataIndex: 'Total2'
    }]
});