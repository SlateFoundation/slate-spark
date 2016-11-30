/**
 * The top level container for the Lessons section of the website
 *
 * @event lessonupdate
 * Fires when the lesson has been updated.
 * @param {SparkRepositoryManager.view.lessons.Panel} lessonContainer
 * @param {SparkRepositoryManager.model.Lesson} lesson
 * @param {SparkRepositoryManager.model.Lesson} oldLesson
 */
Ext.define('SparkRepositoryManager.view.lessons.Panel', {
    extend: 'Ext.panel.Panel',
    xtype: 's2m-lessons-panel',
    requires: [
        'SparkRepositoryManager.view.lessons.Navigator',
        'SparkRepositoryManager.view.lessons.editor.Editor'
    ],

    config: {
        lesson: null
    },

    layout: 'border',

    items: [
        {
            region: 'west',
            xtype: 's2m-lessons-navigator',
            width: 320
        },
        {
            region: 'center',
            xtype: 's2m-lessons-editor'
        }
    ],

    /*
     * update "magic method" will not be called when record values are changed,
     * so we clone the record to force an update call.
     * TODO: find another way
     */
    applyLesson: function(lesson) {
        var clone = lesson.copy();

        lesson.destroy();

        return clone;
    },

    updateLesson: function(lesson, oldLesson) {
        var me = this;

        me.fireEvent('lessonupdate', me, lesson, oldLesson);
    }

});
