/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.model.Sparkpoint', {
    extend: 'Jarvus.model.Postgrest',

    tooltipTpl: [
        '<p>The full description of <em>{Code}</em> can be displayed here <strong>with arbitrary markup</strong></p>',
        '<tpl if="Description">',
            '<p>{Description}</p>',
        '</tpl>'
    ],

    tableUrl: '/mock-sparkpoints',

    fields: [
        'id',
        'content_area_id',
        { name: 'code', defaultValue: '' },
        { name: 'power', defaultValue: false },
        { name: 'teacher_title', defaultValue: '' },
        { name: 'student_title', defaultValue: '' },
        { name: 'teacher_description', defaultValue: '' },
        { name: 'student_description', defaultValue: '' }
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