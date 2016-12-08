/**
 * This component is displayed in the Student Work as the active tab when the student has not completed a preceding phase.
 * Provides the option for the teacher to move the student to a subsequent phase.
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

        /**
         * @required
         * @private
         */
        moveToPhase: null,

        layout: {
            type: 'vbox',
            align: 'center'
        },

        items: [{
            xtype: 'panel',
            cls: 'content-card',
            style: 'background: white;',
            layout: {
                type: 'vbox',
                align: 'center'
            },
            items: [{
                xtype: 'component',
                cls: 'spark-teacher-work-move-text'
            }, {
                xtype: 'button',
                cls: 'spark-teacher-work-move-btn x-button-action'
            }]
        }]
    },

    updateMoveToPhase: function(phase) {
        var me = this,
            moveBtn = me.down('button[cls~="spark-teacher-work-move-btn"]'),
            activePhase = me.getActivePhase();

        me.moveToPhase = phase;
        moveBtn.setText('Move to ' + phase.charAt(0).toUpperCase() + phase.slice(1));

        moveBtn.setDisabled(phase === activePhase);
    },

    getMoveToPhase: function() {
        return this.moveToPhase;
    },

    loadMoveText: function() {
        var me = this,
            moveText = me.down('[cls~="spark-teacher-work-move-text"]'),
            name = me.getStudentName(),
            phase = me.getActivePhase();

        if (!Ext.isEmpty(name) && !Ext.isEmpty(phase)) {
            moveText.setHtml(name + ' is currently working on <span class="phase-highlight">' + phase.charAt(0).toUpperCase() + phase.slice(1) + '</span>');
        }
    }
});