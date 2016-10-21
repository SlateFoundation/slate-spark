/**
 * This component is displayed in the Student Work as the active tab when the student has not completed a previous phase.
 * Provides the option for the teacher to move the student to the next phase.
 */
Ext.define('SparkClassroomTeacher.view.work.MovePhaseContainer', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-work-move-phase',

    config: {

        /**
         * @required
         * @private
         */
        activePhase: null,

        /**
         * @required
         * @private
         */
        studentName: null,

        layout: {
            type: 'vbox',
            align: 'center'
        },

        items: [{
            xtype: 'panel',
            cls: 'content-card',
            items: [{
                xtype: 'component',
                cls: 'spark-teacher-work-move-text'
            }, {
                xtype: 'button',
                cls: 'spark-teacher-work-move-btn x-button-action'
            }]
        }]
    },

    setActivePhase: function(phase) {
        var me = this,
            moveBtn = me.down('button[cls~="spark-teacher-work-move-btn"]');

        me.activePhase = phase;
        moveBtn.setText('Move to ' + phase.charAt(0).toUpperCase() + phase.slice(1));
        me.setMoveText(me.getStudentName(), phase);
    },

    setStudentName: function(name) {
        var me = this;

        me.studentName = name;
        me.setMoveText(name, me.getActivePhase());
    },

    /**
     * @private
     * @param name
     * @param phase
     */
    setMoveText: function(name, phase) {
        var me = this,
            moveText = me.down('[cls~="spark-teacher-work-move-text"]');

        if (!Ext.isEmpty(name) && !Ext.isEmpty(phase)) {
            moveText.setHtml(name + ' is currently working on <strong>' + phase.charAt(0).toUpperCase() + phase.slice(1) + '</strong>');
        }
    }
});