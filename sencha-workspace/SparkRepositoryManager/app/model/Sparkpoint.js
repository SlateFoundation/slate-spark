/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.model.Sparkpoint', {
    extend: 'Ext.data.Model',
    requires: [
        'SparkRepositoryManager.proxy.Sparkpoints'
    ],


    tooltipTpl: [
        '<dl>',
            '<tpl if="abbreviation">',
                '<dt>Abbreviation</dt>',
                '<dt>{abbreviation}</dt>',
            '</tpl>',
            '<tpl if="teacher_title">',
                '<dt>Teacher Title</dt>',
                '<dt>{teacher_title}</dt>',
            '</tpl>',
            '<tpl if="teacher_description">',
                '<dt>Teacher Description</dt>',
                '<dt>{teacher_description}</dt>',
            '</tpl>',
        '</dl>'
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
        { name: 'dependents_count', persist: false },
        { name: 'alignments_count', persist: false }
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