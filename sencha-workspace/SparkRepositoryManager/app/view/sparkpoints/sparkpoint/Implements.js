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
            { code: 'K.CC.JK.1' },
            { code: 'K.CC.JK.2' },
            { code: 'K.CC.JK.3' },
            { code: 'K.CC.JK.4' }
        ]
    },

    rootVisible: false,
    useArrows: true,
    singleExpand: true,
    hideHeaders: true,

    columns: [{
        xtype: 'srm-standardcolumn',
        name: 'code',
        flex: 5,
        dataIndex: 'code'
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
