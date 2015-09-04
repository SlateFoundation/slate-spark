/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.SectionStudent', {
    extend: 'Ext.data.Model',

    fields: [
        'Student',
        'Section',
        'GPSStatus',
        'GPSStatusGroup',
        'Help',
        'Priority',
        'Standards',
        'Grade'
    ]
});