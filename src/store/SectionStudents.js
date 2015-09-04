/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.SectionStudents', {
    extend: 'Ext.data.Store',
    requires: ['SparkClassroom.model.SectionStudent'],
    
    config: {
        model: 'SparkClassroom.model.SectionStudent',
    }
});