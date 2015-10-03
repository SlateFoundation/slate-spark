/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.gps.Assess', {
    extend: 'Ext.data.ChainedStore',


    config: {
        source: 'gps.ActiveStudents',
        filters: [{
            property: 'phase',
            value: 'assess'
        }]
    }
});