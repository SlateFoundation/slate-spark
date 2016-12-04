/**
 * The top-level scrollable container for the application containing the config
 * variables that drive the application's top-level state.
 */
Ext.define('SparkClassroomStudent.view.AppContainer', {
    extend: 'Ext.Container',
    xtype: 'spark-student-appct',


    eventedConfig: {

        /**
         * @cfg {String}
         * The code for the course section selected for loading by the user. This config gets
         * set first when the user indicates their intent to navigate to a given section code,
         * and it may not necessarily reflect a valid or available section.
         *
         * The {@link #event-selectedsectioncodechange} event is fired when this config changes,
         * which should trigger all section selection UI to update immediately and new data to
         * begin loading.
         */
        selectedSectionCode: null,

        /**
         * @cfg {String}
         * The code for the sparkpoint selected for loading by the user. This config gets
         * set first when the user indicates their intent to navigate to a given sparkpoint,
         * and it may not necessarily reflect a valid or available sparkpoint.
         *
         * The {@link #event-selectedsparkpointcodechange} event is fired when this config changes,
         * which should trigger all sparkpoint selection UI to update immediately and new data to
         * begin loading.
         */
        selectedSparkpointCode: null,

        /**
         * @cfg {SparkClassroom.model.StudentSparkpoint}
         * The loaded student sparkpoint model instance for the application. This config gets
         * set following a change in {@link #cfg-selectedSparkpointCode} and successful load
         * of the indicated sparkpoint and associated student progress data.
         */
        loadedStudentSparkpoint: null
    },

    config: {

        /**
         * Use `auto` layout to simply stack child elements and leave it to CSS to lay them out
         * @ignore
         */
        layout: 'auto',

        /**
         * Enable vertical scrolling
         * @ignore
         */
        scrollable: 'vertical'
    },

    constructor: function() {
        var me = this;

        /**
         * This object instance approximates the API provided by stores to receive events
         * from models that belong to them. It is attached to studentSparkpoint models
         * by the updateLoadedStudentSparkpoint method below.
         */
        me.loadedStudentSparkpointEventProxy = {
            afterEdit: function(studentSparkpoint, modifiedFieldNames) {
                me.fireEvent('loadedstudentsparkpointupdate', me, studentSparkpoint, modifiedFieldNames);
            }
        };

        me.callParent(arguments);
    },

    updateLoadedStudentSparkpoint: function(studentSparkpoint, oldStudentSparkpoint) {
        var eventProxy = this.loadedStudentSparkpointEventProxy;

        if (oldStudentSparkpoint) {
            oldStudentSparkpoint.unjoin(eventProxy);
        }

        if (studentSparkpoint) {
            studentSparkpoint.join(eventProxy);
        }
    }
});