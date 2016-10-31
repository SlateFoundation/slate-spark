Ext.define('SparkRepositoryManager.model.Module', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.proxy.LocalStorage'
    ],

    proxy: {
        type: 'localstorage',
        id: 'module-dev'
    },

    fields: [
        {
            name: 'id'
        },
        {
            name: 'title',
            type: 'string'
        },
        {
            name: 'code',
            type: 'string',
            defaultValue: 'DRAFT'
        },
        {
            name: 'contentAreaId',
            mapping: 'content_area_id',
            type: 'int',
            allowNull: true,
            defaultValue: null
        },
        {
            name: 'author_id',
            type: 'int'
        },
        {
            name: 'published',
            type: 'bool'
        },
        {
            name: 'global',
            type: 'bool'
        },
        {
            name: 'prompt',
            type: 'string'
        },
        {
            name: 'sparkpoints',
            type: 'auto',
            default: []
        },
        {
            name: 'learns',
            type: 'auto',
            default: []
        },
        {
            name: 'conference_questions',
            type: 'auto',
            default: []
        },
        {
            name: 'conference_resources',
            type: 'auto',
            default: []
        },
        {
            name: 'applies',
            type: 'auto',
            default: []
        },
        {
            name: 'asessments',
            type: 'auto',
            default: []
        }
    ]

});

