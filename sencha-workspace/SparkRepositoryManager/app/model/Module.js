Ext.define('SparkRepositoryManager.model.Module', {
    extend: 'Ext.data.Model',
    requires: [
        'SparkRepositoryManager.model.ModuleData'
    ],

    proxy: {
        // TODO: this proxy is a dev workaround to contact a different API host
        type: 'sandbox-school',
        url: '/spark/api/work/modules',
        reader: {
            type: 'json'
        }
    },

    identifier: 'negative',
//    idProperty: 'dummyId',

    fields: [
        {
            name: 'id',
            type: 'auto',
            allowNull: true
        },
        {
            name: 'dummyId',
            type: 'auto',
            persist: false,
            allowNull: true
        },
        {
            name: 'code',
            type: 'string',
            persist: false,
            allowNull: true
        },
        {
            name: 'author_id',
            type: 'int',
            critical: true,
            allowNull: true
        },
        {
            name: 'created',
            type: 'date',
            dateFormat: 'timestamp',
            critical: true,
            allowNull: true
        },
        {
            name: 'modified',
            type: 'date',
            dateFormat: 'timestamp',
            critical: true,
            allowNull: true
        },
        {
            name: 'published',
            type: 'date',
            // dateFormat: 'timestamp',
            dateFormat: 'c',
            critical: true,
            allowNull: true
        },

/*
        {
            name: 'template',
            type: 'string',
            allowNull: true,
            convert: function(val, rec) {
                return Ext.encode(rec.get('moduleData'));
            }
        },
        {
            name: 'moduleData',
            type: 'auto',
            defaultValue: {},
            persist: false
        },
*/

        {
            name: 'global',
            critical: true,
            type: 'bool'
        },
        {
            name: 'grade',
            type: 'string',
            critical: true,
            allowNull: true
        },
        {
            name: 'content_area',
            type: 'int',
            critical: true,
            allowNull: true
        },
        {
            name: 'title',
            type: 'string',
            critical: true
        },
        {
            name: 'directions',
            type: 'string',
            critical: true
        },
        {
            name: 'phase_start',
            type: 'auto',
            critical: true,
            default: {}
        },
        {
            name: 'sparkpoints',
            type: 'auto',
            critical: true,
            default: 'yo'
        },
        {
            name: 'learns',
            type: 'auto',
            critical: true,
            default: []
        },
        {
            name: 'conference_questions',
            type: 'auto',
            critical: true,
            default: []
        },
        {
            name: 'conference_resources',
            type: 'auto',
            critical: true,
            default: []
        },
        {
            name: 'applies',
            type: 'auto',
            critical: true,
            default: []
        },

        // Define tree fields so persist can be set to false
        {
            name: 'leaf',
            persist: false
        },
        {
            name: 'prompt',
            persist: false
        },
        {
            name: 'parentId',
            persist: false,
            convert: function(val, rec) {
        //        return rec.get('global') === true ? 'global' : 'personal';
                return null;
            }
        }

    ]

});

