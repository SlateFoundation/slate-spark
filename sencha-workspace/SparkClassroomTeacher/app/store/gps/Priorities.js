/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.gps.Priorities', {
    extend: 'Ext.data.ChainedStore',

    storeId: 'Priorities',
    source: 'SectionStudents', // TODO: update
    filters: [
        function (student) {
            return Ext.isNumber(student.get('Priority'));
        }
    ]
});