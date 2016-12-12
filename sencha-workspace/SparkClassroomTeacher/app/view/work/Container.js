Ext.define('SparkClassroomTeacher.view.work.Container', {
    extend: 'SparkClassroom.work.Container',
    xtype: 'spark-teacher-work-ct',
    requires: [
        'Ext.tab.Bar',
        'SparkClassroom.model.work.Lesson'
    ],


    config: {
        lesson: null
    },

    applyLesson: function(lessonData, lesson) {
        if (!lessonData) {
            return null;
        }

        if (lessonData.isModel) {
            return lessonData;
        }

        if (lesson && lessonData.id === lesson.getId()) {
            lesson.set(lessonData, { dirty: false });
            return lesson;
        }

        return Ext.create('SparkClassroom.model.work.Lesson', lessonData);
    },

    updateLesson: function(lesson, oldLesson) {
        this.fireEvent('lessonchange', this, lesson, oldLesson);
    }
});
