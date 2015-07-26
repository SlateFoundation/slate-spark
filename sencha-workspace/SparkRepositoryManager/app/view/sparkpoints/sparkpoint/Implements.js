Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.Implements', {
    extend: 'Ext.grid.Panel',
    xtype: 'srm-sparkpoints-sparkpointimplements',

    requires: [
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.ImplementsController'
    ],

    title: 'Implements',

    controller: 'srm-sparkpoints-sparkpointimplements-controller',

    config: {
        tooltip: null,
        tooltipTemplate: [
            '<h6>{Title}</h6>',
            '<p>line 1.....</p>'
        ]
    },

    listeners: {
        afterrender: 'onAfterrender'
    },

    store:{
        fields: [
             {name: 'Title', type: 'string'}
        ],
        data: [
            { Title: 'K.CC.JK.1' },
            { Title: 'K.CC.JK.2' },
            { Title: 'K.CC.JK.3' },
            { Title: 'K.CC.JK.4' }
        ]
    },

    rootVisible: false,
    useArrows: true,
    singleExpand: true,
    hideHeaders: true,

    columns: [{
        name: 'Title',
        flex: 5,
        dataIndex: 'Title'
    },{
        xtype: 'actioncolumn',
        width: 32,
        // TODO: replace placeholder image
        icon: 'http://i.imgur.com/wb1NW8I.png'
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
