Ext.define('SparkClassroomTeacher.view.AppContainer', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-appct',

     /**
     * @event selectedstudentsparkpointchange
     * Fires when the user selects a course section.
     * @parem {SparkClassroomTeacher.view.AppContainer} appCt
     * @param {SparkClassroomTeacher.model.gps.ActiveStudent} selectedStudentSparkpoint The newly selected StudentSparkpoint object
     * @param {SparkClassroomTeacher.model.gps.ActiveStudent/null} oldSelectedStudentSparkpoint The previously selected StudentSparkpoint if any
     */

    config: {
        /**
         * Tracks the currently selected {@link SparkClassroomTeacher.model.gps.ActiveStudent}
         */
        selectedSection: null,
        selectedStudentSparkpoint: null,

        layout: 'auto',
        scrollable: 'vertical'
    },

    updateSelectedSection: function(selectedSection, oldSelectedSection) {
        var me = this;

        me.setSelectedStudentSparkpoint(null);
        me.fireEvent('selectedsectionchange', me, selectedSection, oldSelectedSection);
    },

    updateSelectedStudentSparkpoint: function(selectedStudentSparkpoint, oldSelectedStudentSparkpoint) {
        this.fireEvent('selectedstudentsparkpointchange', this, selectedStudentSparkpoint, oldSelectedStudentSparkpoint);
    }
});