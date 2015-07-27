Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.Implements', {
    extend: 'Ext.grid.Panel',
    xtype: 'srm-sparkpoints-sparkpointimplements',

    requires: [
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.ImplementsController',
        'SparkRepositoryManager.model.Standard',
        'SparkRepositoryManager.column.Standard'
    ],

    title: 'Implements',

    controller: 'srm-sparkpoints-sparkpointimplements',

    store:{
        model: 'SparkRepositoryManager.model.Standard',
        data: [
            { Code: 'K.CC.JK.1' },
            { Code: 'K.CC.JK.2' },
            { Code: 'K.CC.JK.3' },
            { Code: 'K.CC.JK.4' }
        ]
    },

    rootVisible: false,
    useArrows: true,
    singleExpand: true,
    hideHeaders: true,

    columns: [{
        xtype: 'srm-standardcolumn',
        name: 'Code',
        flex: 5,
        dataIndex: 'Code'
    },{
        xtype: 'actioncolumn',
        action: 'delete',
        width: 32,
        icon: 'http://www.goodsync.com/images/icons/C_Dis_Cir.png',
        tooltip: 'Delete'
    }],

    dockedItems: [{
        dock: 'bottom',

        xtype: 'toolbar',
        items: [{
            flex: 1,

            xtype: 'textfield'
        },{
            xtype: 'button',
            text: 'Add'
        }]
    }]
});
