Ext.define('SparkClassroom.k1.CountdownTimer', {
    extend: 'Ext.Component',
    xtype: 'spark-k1-countdown-timer',
    requires: [
        'Ext.util.TaskManager'
    ],

    config: {
        cls: 'spark-work-timer',
        record: null,
        data: {
            minutes: 0,
            seconds: 0
        },
        tpl: [
            '<div class="timer-icon"></div>',
            '<div class="timer-play-pause"></div>',
            '<tpl if="!Ext.isEmpty(values.seconds)">',
                '<input type="text" class="timer-counter"></input>',
            '</tpl>',
            '<div class="timer-reset"></div>'
        ],

        listeners: {
            click: {
                element: 'element',
                fn: function(e, target) {
                    var me = this,
                        rec;

                    if (target.className.indexOf('timer-play-pause') > -1) {
                        if (!me.getRecord()) {
                            // initialize with a blank record
                            rec = new Ext.data.Record({
                                'timer_time': 0,
                                'accrued_seconds': 0
                            });

                            me.setRecord(rec);
                        }

                        me.toggle();
                    } else if (target.className.indexOf('timer-reset') > -1) {
                        me.setRecord(null);
                        me.refresh();
                        me.fireEvent('reset');
                    }
                }
            }
        },
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

    // timer methods
    refresh: function() {
        var me = this,
            record = me.getRecord(),
            state = 'idle',
            baseTime, seconds;

        if (!record) {
            me.setData(null);
            me.setState('idle');
            return;
        }

        baseTime = record.get('base_time');
        seconds = record.get('seconds');

        if (seconds) {
            state = 'paused'
        }

        me.setState(state);

        me.setData({
            minutes: Math.floor(seconds / 60),
            seconds: Math.floor(seconds) % 60
        });

        me.fireEvent('datachange', seconds, me.getState());
    },
});