/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.work.Apply', {
    extend: 'Ext.data.Model',

    fields: [
        'id',
        'title',
        'instructions',
        'dok',
        'sparkpointIds',
        'sparkpointCodes',
        'standardCodes',
        'todos',
        {
            name: 'links',

            /**
             * Normalize old array-of-urls format to new array of title/url pair objects
             */
            convert: function (value) {
                if (!Ext.isArray(value) || !Ext.isString(value[0])) {
                    return value;
                }

                var links = [],
                    i = 0,
                    count = value.length;

                for (; i<count; i++) {
                    links.push({
                        title: null,
                        url: value[i]
                    });
                }

                return links;
            }
        },

        // student-personalized fields
        {
            name: 'sparkpoint',
            critical: true
        },
        {
            name: 'selected',
            type: 'boolean',
            defaultValue: false
        }
    ],

    proxy: {
        type: 'slate-api',
        url: '/spark/api/work/applies',
        writer: {
            type: 'json',
            allowSingle: true
        }
    }
});
