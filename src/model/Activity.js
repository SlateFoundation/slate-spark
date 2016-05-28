/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.Activity', {
    extend: 'Ext.data.Model',
    // extend: 'SparkClassroom.model.StudentSparkpoint',
    requires: [
        'Slate.proxy.API'
    ],

    idProperty: 'student_sparkpointid',

    fields: [
        'section_id',
        'section_code',

        'sparkpoint_id',
        'student_id',

        {
            name: 'student_sparkpointid',
            depends: ['student_id', 'sparkpoint_id'],
            persist: false,
            crtical: true,
            convert: function(v, r) {
                return r.get('student_id') + '_' + r.get('sparkpoint_id');
            }
        }
    ],

    proxy: {
        type: 'slate-api',
        url: '/spark/api/work/activity',

        extraParams: {
            status: 'all'
        }
    }
});