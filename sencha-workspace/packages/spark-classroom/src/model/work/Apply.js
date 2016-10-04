/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.work.Apply', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.proxy.API'
    ],


    idProperty: 'resource_id',
    fields: [
        {
            name: 'resource_id',
            type: 'int'
        },
        'title',
        'instructions',
        'dok',
        'standardCodes',
        'rating',
        'comment',
        {
            name: 'todos',
            convert: function (value) {
                return value || [];
            }
        },
        {
            name: 'submissions',
            convert: function (value) {
                return value || [];
            }
        },
        {
            name: 'links',

            // normalize old array-of-urls format to new array of title/url pair objects
            convert: function (value) {
                if (!value || !Ext.isArray(value)) {
                    return [];
                }

                if (!Ext.isString(value[0])) {
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
        },
        {
            name: 'reflection',
            allowNull: true
        },
        {
            name: 'grade',
            allowNull: true,
            defaultValue: null
        },
        {
            name: 'assignments',
            persist: false,
            depends: [],

            // TODO: remove default to assignment when assignment gets changes to assignments in work/learns API response
            convert: function(v, r) {
                return v || r.get('assignment') || {};
            }
        },
        {
            name: 'effective_assignment',
            persist: false,
            depends: ['assignments'],

            convert: function(v, r) {
                var assignments = r.get('assignments');

                return assignments.student || assignments.section || null;
            }
        },
        {
            name: 'user_rating',
            persist: false,

            depends: 'rating',
            calculate: function(data) {
                var rating = null;
                if (Ext.isObject(data.rating)) {
                    rating = data.rating.user;
                }
                return rating;
            }
        },
        {
            name: 'student_rating',
            persist: false,

            depends: 'rating',
            calculate: function(data) {
                var rating = null;
                if (Ext.isObject(data.rating)) {
                    rating = data.rating.student;
                }
                return rating;
            }
        },
        {
            name: 'teacher_rating',
            persist: false,

            depends: 'rating',
            calculate: function(data) {
                var rating = null;
                if (Ext.isObject(data.rating)) {
                    rating = data.rating.teacher;
                }
                return rating;
            }
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
