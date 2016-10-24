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

    /**
     * @event togglestudentmultiselect
     * Fire when student multiselect has been enabled or disabled.
     * @parem {SparkClassroomTeacher.view.AppContainer} appCt
     * @param {Boolean} New value
     * @param {Boolean} Old value
     */

    config: {

        /**
         * Tracks the currently selected {@link SparkClassroom.model.StudentSparkpoint}
         */
        selectedSection: null,
        selectedStudentSparkpoint: null,
        studentMultiselectEnabled: false,

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
    },

    toggleStudentMultiselect: function(enable) {
        var me = this,
            oldVal = me.getStudentMultiselectEnabled();

        me.setStudentMultiselectEnabled(enable);
        me.fireEvent('togglestudentmultiselect', me, enable, oldVal);
    }
});