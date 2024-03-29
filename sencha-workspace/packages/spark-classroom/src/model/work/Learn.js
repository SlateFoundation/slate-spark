/* global Slate */
/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.work.Learn', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.API'
    ],


    idProperty: 'resource_id',
    fields: [
        {
            name: 'resource_id',
            type: 'int'
        },
        {
            name: 'type',
            allowNull: true
        },
        'title',
        'url',
        'dok',
        'rating',
        'score',
        'attachments',
        'vendor',
        {
            name: 'launch_url',
            convert: function(v) {
                return Slate.API.buildUrl(v);
            }
        },
        {
            name: 'launched',
            type: 'boolean',
            defaultValue: false
        },
        {
            name: 'completed',
            type: 'boolean',
            defaultValue: false
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
        },

        // for teacher assign UI
        {
            name: 'assignments',
            persist: false,

            // TODO: remove default to assignment when assignment gets changes to assignments in work/learns API response
            convert: function(v, r) {
                return v || r.get('assignment') || {};
            }
        }
    ]
});