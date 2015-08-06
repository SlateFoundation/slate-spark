/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.model.Sparkpoint', {
    extend: 'Ext.data.Model',
    requires: [
        'SparkRepositoryManager.proxy.Sparkpoints'
    ],


    tooltipTpl: [
        '<h1>{abbreviation}</h1>',
        '<h2>{code}</h2>',
        '<tpl if="teacher_title">',
            '<strong>{teacher_title}</strong>',
        '</tpl>',
        '<tpl if="teacher_description">',
            '<p>{teacher_description}</p>',
        '</tpl>'
    ],

    proxy: {
        type: 'spark-sparkpoints',
        url: '/spark-repo/sparkpoints'
    },

    fields: [
        'id',
        'content_area_id',
        { name: 'abbreviation', defaultValue: '' },
        { name: 'code', defaultValue: '' },
        { name: 'teacher_title', defaultValue: '' },
        { name: 'student_title', defaultValue: '' },
        { name: 'teacher_description', defaultValue: '' },
        { name: 'student_description', defaultValue: '' },
        // { name: 'power', defaultValue: false },
        { name: 'dependencies_count', persist: false },
        { name: 'dependents_count', persist: false }
    ],

    validators: {
        content_area_id: {
            type: 'range',
            min: 1
        },
        code: {
            type: 'length',
            min: 1
        },
        teacher_title: {
            type: 'length',
            min: 2
        }
    }
});