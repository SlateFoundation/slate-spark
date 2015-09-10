/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.Activities', {
    extend: 'Ext.data.Store',
    requires: ['SparkClassroom.model.Activities'],
    
    config: {
        // Boiler plate schema based on layout only.  Do not reference this in any way
        groupField: 'ActivityDate',
        model: 'SparkClassroom.model.Activities',
        data: [
            { FirstName: 'Berta', LastName: 'B', Activity: 'CCS.Math.Content.1.0A.A.1', Grade: 'C', ActivityDate: 'Today'},
            { FirstName: 'Small', LastName: 'Group', Activity: 'Glennie Glattison, Jimmy Jaquith, Nelle Northern', Grade: null, ActivityDate: 'Today'},
            { FirstName: 'William', LastName: 'F', Activity: 'CCS.ELA-Literacy.4.A.3', Grade: 'Assess 8/10', ActivityDate: 'Today'},
            { FirstName: 'Christian', LastName: 'K', Activity: 'CCS.Math.Content.1.0A.A.1', Grade: 'C', ActivityDate: 'Yesterday'},
            { FirstName: 'William', LastName: 'F', Activity: 'CCS.ELA-Literacy.4.A.3', Grade: 'Assign Learn', ActivityDate: 'Yesterday'},
            { FirstName: 'Small', LastName: 'Group', Activity: 'Glennie Glattison, Jimmy Jaquith, Nelle Northern', Grade: null, ActivityDate: 'Yesterday'}
        ]
    }
});