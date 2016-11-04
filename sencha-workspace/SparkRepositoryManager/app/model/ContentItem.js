Ext.define('SparkRepositoryManager.model.ContentItem', {
    extend: 'Ext.data.Model',
    requires: [
    //    'SparkRepositoryManager.proxy.API',
        'SparkRepositoryManager.proxy.SandboxSchool',
        'Ext.data.identifier.Negative'
    ],

    // model config
    idProperty: 'id',
    identifier: 'negative',

    fields: [
        {
            name: 'class',
            type: 'string'
        },
        {
            name: 'created',
            type: 'date',
            dateFormat: 'c',
            allowNull: true
        },
        {
            name: 'creatorid',
            type: 'int',
            allowNull: true
        },
        {
            name: 'title',
            type: 'string'
        },
        {
            name: 'url',
            type: 'string'
        },
        {
            name: 'vendorid',
            type: 'int',
            allowNull: true
        },
        {
            name: 'gradelevel',
            type: 'string',
            allowNull: true
        },
        {
            name: 'dok',
            type: 'int',
            allowNull: true
        },
        {
            name: 'standards',
            type: 'auto',
            allowNull: true
        },
        {
            name: 'standardids',
            type: 'auto',
            allowNull: true
        },
        {
            name: 'meta',
            allowNull: true
        },
        {
            name: 'type',
            type: 'string',
            allowNull: true
        },
        {
            name: 'fusebox_id',
            type: 'int',
            allowNull: true
        },
        {
            name: 'sparkpoints',
            type: 'auto',
            allowNull: true
        },
        {
            name: 'sparkpoint_ids',
            type: 'auto',
            allowNull: true
        },
        {
            name: 'sparkpointGroup',
            type: 'auto',
            allowNull: true,
            persist: false
        }
    ]

});
