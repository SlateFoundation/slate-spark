Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.Alignments', {
    extend: 'Ext.grid.Panel',
    xtype: 'srm-sparkpoints-sparkpointalignments',
    requires: [
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.AlignmentsController',
        'SparkRepositoryManager.field.StandardLookup',
        'SparkRepositoryManager.column.Standard'
    ],

    controller: 'srm-sparkpoints-sparkpointalignments',

    title: 'Alignments',

    store: 'sparkpoints.Alignments',

    rootVisible: false,
    useArrows: true,
    singleExpand: true,
    hideHeaders: true,
    viewConfig: {
        emptyText: 'None declared yet'
    },

    columns: [{
        flex: 1,

        // xtype: 'srm-standardcolumn',
        dataIndex: 'asn_id'
    },{
        width: 32,

        xtype: 'actioncolumn',
        action: 'delete',
        icon: 'http://www.goodsync.com/images/icons/C_Dis_Cir.png',
        tooltip: 'Delete'
    }],

    dockedItems: [{
        dock: 'bottom',

        xtype: 'toolbar',
        items: [{
            reference: 'lookupCombo',
            flex: 1,

            xtype: 'srm-field-standardlookup'
        },{
            reference: 'addButton',
            xtype: 'button',
            action: 'add',
            disabled: true,
            text: 'Add'
        }]
    }]
});
