Ext.define('SparkClassroom.work.Timer', {
    extend: 'Ext.Component',
    xtype: 'spark-work-timer',
    requires: [
        'Ext.util.TaskManager'
    ],


    config: {
        record: null,
        state: 'running',
        baseField: 'timer_time',
        bankedField: 'accrued_seconds',
        closedField: 'closed_time',

        cls: 'spark-work-timer',
        data: {
            minutes: 0,
            seconds: 0
        },
        tpl: [
            '<div class="timer-icon"></div>',
            '<div class="timer-play-pause"></div>',
            '<tpl if="!Ext.isEmpty(values.seconds)">',
                // TODO count hours
                '<div class="timer-counter">00:{minutes:leftPad(2, "0")}:{seconds:leftPad(2, "0")}</div>',
            '</tpl>',
            '<div class="timer-reset"></div>'
        ]
    },


    constructor: function() {
        var me = this;

        me.refreshTask = Ext.util.TaskManager.newTask({
            interval: 1000,
            scope: me,
            run: me.refresh,
            fireOnStart: true
        });

        me.callParent(arguments);
    },


    // config handlers
    updateRecord: function(record, oldRecord) {
        var me = this,
            refreshTask = me.refreshTask;

        me.refresh();

        if (record) {
            refreshTask.start();
        } else {
            refreshTask.stop();
        }

        me.fireEvent('recordchange', me, record, oldRecord);
    },

    applyState: function(state) {
        if (state != 'paused' && state != 'stopped' && state != 'running') {
            state = 'idle';
        }

        return state;
    },

    updateState: function(state, oldState) {
        var me = this;

        if (oldState) {
            me.removeCls('timer-' + oldState);
        }

        if (state) {
            me.addCls('timer-' + state);
        }

        me.fireEvent('statechange', me, state, oldState);
    },


    // timer methods
    refresh: function() {
        var me = this,
            record = me.getRecord(),
            baseTime, seconds;

        if (!record) {
            me.setData(null);
            me.setState('idle');
            return;
        }

        baseTime = record.get(me.getBaseField());
        seconds = record.get(me.getBankedField()) || 0;

        if (baseTime) {
            seconds += Math.max(0, (Date.now() - baseTime) / 1000);
        }

        me.setState(
            record.get(me.getClosedField()) ?
            'stopped' :
            (
                baseTime ?
                'running' :
                'paused'
            )
        );

        me.setData({
            minutes: Math.floor(seconds / 60),
            seconds: Math.floor(seconds) % 60
        });
    },

    pause: function() {
        var me = this,
            record = me.getRecord(),
            baseField = me.getBaseField(),
            bankedField = me.getBankedField();

        if (!record || me.getState() != 'running') {
            return;
        }

        record.beginEdit();
        record.set(bankedField, record.get(bankedField) + (Date.now() - record.get(baseField)) / 1000);
        record.set(baseField, null);
        record.endEdit();
    },

    resume: function() {
        var me = this,
            record = me.getRecord();

        if (!record || me.getState() != 'paused') {
            return;
        }

        record.set(me.getBaseField(), new Date());
    },

    toggle: function() {
        var me = this;

        switch (me.getState()) {
            case 'running':
                return me.pause();
            case 'paused':
                return me.resume();
        }
    }
});