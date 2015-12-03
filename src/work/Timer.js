Ext.define('SparkClassroom.work.Timer', {
    extend: 'Ext.Component',
    xtype: 'spark-work-timer',
    requires: [
        'Ext.util.TaskManager'
    ],


    config: {
        record: null,
        paused: false,
        baseField: 'timer_time',
        bankedField: 'accrued_seconds',

        cls: 'spark-work-timer',
        data: {
            minutes: 0,
            seconds: 0
        },
        tpl: [
            '<div class="timer-icon"></div>',
            '<tpl if="!Ext.isEmpty(values.seconds)">',
                '<div class="timer-counter">{minutes}:{seconds:leftPad(2, "0")}</div>',
            '</tpl>'
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

    updateRecord: function(record, oldRecord) {
        var me = this,
            refreshTask = me.refreshTask;

        if (record) {
            me.setPaused(!record.get(me.getBaseField()));
            me.refresh();
            refreshTask.start();
        } else {
            refreshTask.stop();
            me.setData(null);
        }

        me.fireEvent('recordchange', me, record, oldRecord);
    },

    applyPaused: function(paused) {
        return !!paused;
    },

    updatePaused: function(paused) {
        var me = this,
            record = me.getRecord(),
            baseField = me.getBaseField(),
            bankedField = me.getBankedField(),
            baseTime = record && record.get(baseField);

        if (record) {
            if (paused) {
                if (baseTime) {
                    record.beginEdit();
                    record.set(bankedField, record.get(bankedField) + (Date.now() - baseTime) / 1000);
                    record.set(baseField, null);
                    record.endEdit();
                }
            } else {
                if (!baseTime) {
                    record.set(baseField, new Date());
                }
            }
        }

        me.toggleCls('timer-paused', paused);

        me.fireEvent('pausedchange', me, paused);
    },

    refresh: function() {
        var me = this,
            record = me.getRecord(),
            baseTime = record.get(me.getBaseField()),
            seconds = record.get(me.getBankedField()) || 0;

        if (baseTime) {
            seconds += (Date.now() - baseTime) / 1000;
        }

        me.setPaused(!baseTime);

        me.setData({
            minutes: Math.floor(seconds / 60),
            seconds: Math.floor(seconds) % 60
        });
    }
});