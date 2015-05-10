/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Spark2Manager.model.LearnLink', {
    extend: 'Ext.data.Model',
    requires: [
        'Emergence.ext.proxy.Records',
        'Ext.data.identifier.Negative'
    ],

    // model config
    idProperty: 'ID',
    identifier: 'negative',

    fields: [
        {
            name: "ID",
            type: "int",
            useNull: true
        },
        {
            name: "Class",
            type: "string",
            defaultValue: "Spark2\\LearnLink"
        },
        {
            name: "Created",
            type: "date",
            dateFormat: "timestamp",
            useNull: true
        },
        {
            name: "CreatorID",
            type: "int",
            useNull: true
        },
        {
            name: "RevisionID",
            type: "int",
            useNull: true
        },
        {
            name: "Title",
            type: "string"
        },
        {
            name: "URL",
            type: "string"
        },
        {
            name: "VendorID",
            type: "int",
            useNull: true
        },
        {
            name: "GradeLevel",
            type: "string",
            useNull: true
        },
        {
            name: "DOK",
            type: "int",
            useNull: true
        },
        {
            name: "Standards",
            useNull: true,
            convert: function(val) {
                if (Array.isArray(val)) {
                    return val.map(function(standard) {
                        if (typeof standard === 'object') {
                            return standard.standardCode;
                        } else {
                            return standard;
                        }
                    })
                }

                return [];
            }
        },
        {
            name: "Metadata",
            useNull: true
        }
    ],

    proxy: {
        type: 'records',
        url: '/spark2/learn-links'
    },

    set: function(fieldName, newValue, options) {
        console.log('custom setter called');
        console.log(this.callParent);

        var _value = (typeof fieldName === 'object') ? fieldName : value;

        if (_value && Array.isArray(_value.Standards)) {
            _value.Standards = _value.Standards.map(function(standard) {
                if (typeof standard === 'string') {
                    return { standardCode: standard };
                }

                return standard;
            });

            this.callParent([fieldName, _value, options]);
        } else {
            this.callParent([fieldName, value, options]);
        }
    }
});
