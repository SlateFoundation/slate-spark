Ext.define('SparkClassroomTeacher.view.AppContainer', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-appct',

     /**
     * @event selectedstudentsparkpointchange
     * Fires when the user selects a course section.
     * @parem {SparkClassroomTeacher.view.AppContainer} appCt
     * @param {SparkClassroom.model.StudentSparkpoint} selectedStudentSparkpoint The newly selected StudentSparkpoint object
     * @param {SparkClassroom.model.StudentSparkpoint/null} oldSelectedStudentSparkpoint The previously selected StudentSparkpoint if any
     */

    config: {

        /**
         * Tracks the currently selected {@link SparkClassroom.model.StudentSparkpoint}
         */
        selectedSection: null,
        selectedStudentSparkpoint: null,
        fullscreen: true,
        scrollable: 'vertical',
        padding: '44 0 0 0'
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