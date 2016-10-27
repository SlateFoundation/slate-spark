Ext.define('SparkRepositoryManager.model.Module', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'title',
            type: 'string'
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
            name: 'prompt',
            type: 'string'
        },
        {
            name: 'sparkpoints',
            default: []
        },
        {
            name: 'learns',
            default: []
        },
        {
            name: 'conference_questions',
            default: []
        },
        {
            name: 'conference_resources',
            default: []
        },
        {
            name: 'applies',
            default: []
        },
        {
            name: 'asessments',
            default: []
        }
    ]

});

