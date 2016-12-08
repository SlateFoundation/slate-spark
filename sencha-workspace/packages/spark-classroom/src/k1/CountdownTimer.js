Ext.define('SparkClassroom.k1.CountdownTimer', {
    extend: 'Ext.Component',
    xtype: 'spark-k1-countdown-timer',
    requires: [
        'Ext.util.TaskManager'
    ],

    config: {
        cls: 'spark-countdown-timer',
        state: 'idle',
        section: null,
        record: null,
        data: {
            minutes: 0,
            seconds: 0
        },
        tpl: [
            '<div class="timer-icon"></div>',
            '<div class="timer-play-pause"></div>',
            '<input type="text" class="timer-counter" value="{[values.minutes + ":" + values.seconds]}"></input>',
            '<div class="timer-reset"></div>'
        ],

        listeners: {
            click: {
                element: 'element',
                fn: function(e, target) {
                    var me = this,
                        seconds = 0,
                        section = me.getSection,
                        state = me.getState(),
                        timerTime;

                    if (!section) {
                        return;
                    }

                    if (target.className.indexOf('timer-play-pause') > -1) {
                        timerTime = Ext.get(e.target).
                                        up('.spark-countdown-timer').
                                        down('.timer-counter').
                                        getValue().
                                        split(':');

                        if (Ext.isNumeric(timerTime[0])) {
                            seconds = parseInt(timerTime[0], 10) * 60;
                        }

                        if (Ext.isNumeric(timerTime[1])) {
                            seconds += parseInt(timerTime[1], 10);
                        }

                        if (state === 'idle') {
                            me.newTimer(seconds);
                        } else if (state === 'paused') {
                            me.toggleTimer(false);
                        } else if (state === 'running') {
                            me.toggleTimer(true);
                        }
                    } else if (target.className.indexOf('timer-reset') > -1) {
                        me.resetTimer();
                    }
                }
            }
        }
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

        if (record && record.get('started') && !record.get('paused')) {
            refreshTask.start();
        } else {
            refreshTask.stop();
        }

        me.fireEvent('recordchange', me, record, oldRecord);
    },

    applyState: function(state) {
        if (state !== 'paused' && state !== 'stopped' && state !== 'running' && state != 'complete') {
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
    resetTimer: function() {
        var me = this,
            record = me.getRecord;

        if (!record) {
            me.setTimer(null);
            return;
        }

        me.newTimer(0);
    },

    setTimer: function(data) {
        var me = this,
            minutes, seconds;

        if (!data) {
            me.setData({
                minutes: '00',
                seconds: '00'
            });
            me.setRecord(null);
            me.setState('idle');
            return;
        }

        minutes = Math.floor(data.duration_seconds / 60);
        seconds = data.duration_seconds % 60;

        me.setData({
            minutes: minutes,
            seconds: seconds
        });
        me.setRecord(new Ext.data.Record(data));

        if (!data.started) {
            me.setState('idle');
            return;
        }
        me.setState(data.paused ? 'paused' : 'running');
    },

    refresh: function() {
        var me = this,
            record = me.getRecord(),
            seconds, started, paused, minutes;

        if (!record) {
            return;
        }

        seconds = record.get('duration_seconds');
        started = record.get('started');
        paused = record.get('paused');

        if (started) {
            seconds -= Math.floor(Ext.Date.getElapsed(new Date(started), new Date()) / 1000);
        }

        if (paused) {
            seconds = paused;
        }

        if (seconds < 0) {
            me.setData({
                minutes: '00',
                seconds: '00'
            });
            me.setState('complete');
            return;
        }

        minutes = String(Math.floor(seconds / 60));
        seconds = String(seconds % 60);

        // add leading 0 if single digit
        if (minutes.split('').length === 1) {
            minutes = '0' + minutes;
        }
        if (seconds.split('').length === 1) {
            seconds = '0' + seconds;
        }

        me.setData({
            minutes: minutes,
            seconds: seconds
        });
        me.setState(record.get('paused') ? 'paused' : 'running');
    },

    newTimer: function(seconds) {
        var me = this;

        if (!Ext.isNumeric(seconds)) {
            return;
        }

        // initialize timer on the server, passing 0 for duration_seconds resets the timer
        Slate.API.request({
            method: 'PUT',
            url: '/spark/api/timers',
            jsonData: {
                'duration_seconds': seconds,
                'section': me.getSection()
            },
            success: function(response) {
                me.setTimer(response.data);
            },
            scope: me
        });
    },

    toggleTimer: function(pause) {
        var me = this;

        Slate.API.request({
            method: 'PATCH',
            url: '/spark/api/timers',
            jsonData: {
                'section': me.getSection(),
                'paused': pause
            },
            success: function(response) {
                me.setTimer(response.data);
            },
            scope: me
        });
    }
});