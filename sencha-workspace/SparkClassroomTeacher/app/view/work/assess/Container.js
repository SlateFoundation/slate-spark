Ext.define('SparkClassroomTeacher.view.work.assess.Container', {
    extend: 'SparkClassroom.work.assess.Container',
    xtype: 'spark-teacher-work-assess',
    requires: [
        'SparkClassroomTeacher.view.work.assess.Footer'
    ],

    initialize: function () {
        this.callParent(arguments);

        this.add({
            xtype: 'spark-teacher-work-assess-footer'
        });
    }
});