Ext.define('SparkClassroomStudent.view.work.assess.Container', {
    extend: 'SparkClassroom.work.assess.Container',
    xtype: 'spark-student-work-assess',
    requires: [
        'SparkClassroomStudent.view.work.assess.Footer'
    ],


    config: {
        enableEditing: true
    },

    initialize: function () {
        this.callParent(arguments);

        this.add([
            {
                xtype: 'spark-student-work-assess-footer',
                margin: '0 0 100'
            }
        ]);
    }
});