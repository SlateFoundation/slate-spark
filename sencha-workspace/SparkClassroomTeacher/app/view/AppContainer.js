/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.AppContainer', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-appct',

     /**
     * @event selectedstudentsparkpointchange
     * Fires when the user selects a course section.
     * @parem {SparkClassroomTeacher.view.AppContainer} appCt
     * @param {SparkClassroomTeacher.model.gps.ActiveStudent} selectedStudentSparkpoint The code for the newly selected section
     * @param {SparkClassroomTeacher.model.gps.ActiveStudent/null} oldSelectedStudentSparkpoint The code for the previously selected section if any
     */

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