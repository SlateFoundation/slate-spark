/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.GPS', {
    extend: 'Ext.app.Controller',
    
    stores: [
        'Students',
        'gps.Help',
        'gps.Priorities',
        'gps.Learn',
        'gps.Conference',
        'gps.Apply',
        'gps.Assess',
    ],
    views: [
        'gps.Main'
    ]
});