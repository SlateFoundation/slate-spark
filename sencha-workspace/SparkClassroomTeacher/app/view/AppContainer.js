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
        multiSelectedSparkpoints: null,
        studentMultiselectEnabled: false,

        layout: 'auto',
        scrollable: 'vertical'
    },

	/**
     * Override to also fire the event selectedstudentsparkpointchange
     * @override
     */
    setSelectedStudentSparkpoint: function(sparkpoints) {
        var me = this,
            oldSparkpoint = me.getSelectedStudentSparkpoint();

        me.selectedStudentSparkpoint = sparkpoints;
        me.fireEvent('selectedstudentsparkpointchange', me, me.selectedStudentSparkpoint, oldSparkpoint);
    },

    getSelectedStudentSparkpoint: function() {
        return this.selectedStudentSparkpoint;
    },

    updateMultiSelectedSparkpoints: function(sparkpoints) {
        var me = this,
            oldSparkpoints = me.getMultiSelectedSparkpoints();

        me.setMultiSelectedSparkpoints(sparkpoints);
        me.fireEvent('multiselectedsparkpointschange', me, sparkpoints, oldSparkpoints);
    },

    updateSelectedSection: function(selectedSection, oldSelectedSection) {
        var me = this;

        me.setSelectedStudentSparkpoint(null);
        me.setMultiSelectedSparkpoints(null);
        me.fireEvent('selectedsectionchange', me, selectedSection, oldSelectedSection);
    },

    toggleStudentMultiselect: function(enable) {
        var me = this,
            oldVal = me.getStudentMultiselectEnabled();

        me.setStudentMultiselectEnabled(enable);
        me.setSelectedStudentSparkpoint(null);
        me.updateMultiSelectedSparkpoints(null);
        me.fireEvent('togglestudentmultiselect', me, enable, oldVal);
    }
});