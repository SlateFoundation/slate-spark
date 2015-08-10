Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.Alignments', {
    extend: 'Ext.grid.Panel',
    xtype: 'srm-sparkpoints-sparkpointalignments',

    requires: [
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.AlignmentsController',
        'SparkRepositoryManager.model.Standard',
        'SparkRepositoryManager.column.Standard'
    ],

    title: 'Alignments',

    controller: 'srm-sparkpoints-sparkpointalignments',

    store: 'sparkpoints.Alignments',

    rootVisible: false,
    useArrows: true,
    singleExpand: true,
    hideHeaders: true,

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
            xtype: 'combobox',
            flex: 1,
            store:{
                model: 'SparkRepositoryManager.model.Standard',
                data: [
                    { code: 'K.CC.JK.1' },
                    { code: 'K.CC.JK.2' },
                    { code: 'K.CC.JK.3' },
                    { code: 'K.CC.JK.4' },
                    { code: 'K.CC.JK.5' },
                    { code: 'K.CC.JK.6' },
                    { code: 'K.CC.JK.7' },
                    { code: 'K.CC.JK.8' }
                ]
            },
            queryMode: 'local',
            displayField: 'code',
            valueField: 'code',
            forceSelecton: true,
            typeAhead: true,
            allowBlank: true
        },{
            xtype: 'button',
            action: 'add',
            disabled: true,
            text: 'Add'
        }]
    }]
});
