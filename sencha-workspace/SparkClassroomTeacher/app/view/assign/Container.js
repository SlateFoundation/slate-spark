Ext.define('SparkClassroomTeacher.view.assign.Container', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-assign-ct',
    requires: [
        'SparkClassroomTeacher.view.assign.TabBar',
        'SparkClassroom.widget.SparkpointField',
        'SparkClassroom.model.work.Lesson'
    ],


     /**
     * @event selectedsparkpointchange
     * Fires when the user selects a sparkpoint
     * @param {SparkClassroomTeacher.view.assign.learns.Container} learnsCt
     * @param {String} selectedSparkpoint The newly selected sparkpoint code
     * @param {String/null} oldSelectedSparkpoint The previously selected sparkpoint code
     */


    config: {
        selectedSparkpoint: null,
        lesson: null,

        autoDestroy: false,
        items: [
            {
                docked: 'top',
                xtype: 'container',
                cls: 'spark-assign-sparkpoint-ct',
                layout: {
                    type: 'hbox',
                    pack: 'end'
                },
                items: [
                    {
                        xtype: 'spark-sparkpointfield',
                        label: 'Assign for Sparkpoint',
                        labelAlign: 'left',
                        labelWidth: 152,
                        labelCls: null,
                        width: 440
                    }
                ]
            },
            {
                docked: 'top',
                xtype: 'spark-teacher-assign-tabbar'
            }
        ]
    },

    updateSelectedSparkpoint: function(selectedSparkpoint, oldSelectedSparkpoint) {
        this.fireEvent('selectedsparkpointchange', this, selectedSparkpoint, oldSelectedSparkpoint);
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