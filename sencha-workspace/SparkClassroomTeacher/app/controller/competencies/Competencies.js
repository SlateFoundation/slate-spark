/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.controller.competencies.Competencies', {
    extend: 'Ext.app.Controller',

    requires: [ 'SparkClassroomTeacher.ComponentRef' ],

    routes: {
      'competencies': {
        action: 'rerouteBase'
      }
    }


});
