/**
 * Standards Navigation Panel, an extension of Ext Panel with a vbox layout containing a tree panel
 *
 * @cfg title="ContentAreas"
 */
Ext.define('SparkRepositoryManager.view.sparkpoints.standards.DocumentsTable', {
    extend: 'Ext.grid.Panel',
    xtype: 'srm-sparkpoints-documentstable',
    requires: [
        'Ext.grid.feature.Grouping'
    ],


    title: 'Documents',
    scrollable: true,

    stateful: true,
    stateId: 'srm-sparkpoints-documentstable',

    store: 'StandardDocuments',

    features: [{
        ftype: 'grouping',
        groupHeaderTpl: '{name}'
    }],

    columns: [{
        flex: 1,

        text: 'Subject',
        dataIndex: 'subject',
        hidden: true
    }, {
        flex: 1,

        text: 'Document',
        dataIndex: 'title'
    }, {
        width: 70,

        text: 'Body',
        dataIndex: 'jurisdiction'
    }, {
        width: 100,

        xtype: 'numbercolumn',
        text: 'Standards',
        dataIndex: 'standards_count',
        format: '0,000',
        align: 'right'
    }, {
        width: 80,

        xtype: 'numbercolumn',
        text: 'Groups',
        dataIndex: 'groups_count',
        format: '0,000',
        align: 'right',
        hidden: true
    }, {
        text: 'Grades',
        dataIndex: 'grades',
        hidden: true
    }]
});