/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.AppContainer', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-appct',

    config: {
        /**
         * Tracks the currently selected {@link SparkClassroomTeacher.model.gps.ActiveStudent}
         */
        selectedStudentSparkpoint: null,

        layout: 'auto',
        scrollable: 'vertical'
    },

    updateSelectedStudentSparkpoint: function(selectedStudentSparkpoint, oldSelectedStudentSparkpoint) {
        this.fireEvent('selectedstudentsparkpointchange', this, selectedStudentSparkpoint, oldSelectedStudentSparkpoint);
    }
});