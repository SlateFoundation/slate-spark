Ext.define('SparkClassroom.work.Timer', {
    extend: 'Ext.Component',
    xtype: 'spark-work-timer',
    requires: [
        'Ext.util.TaskManager'
    ],


    config: {
        record: null,
        paused: false,
        startedField: 'timer_started',
        baseField: 'timer_base',
        bankedField: 'timer_banked',
        pausedField: 'timer_paused',

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
            refreshTask = me.refreshTask,
            startedField = me.getStartedField(),
            baseField = me.getBaseField(),
            pausedField = me.getPausedField(),
            now = new Date(),
            paused;

        if (record) {
            if (pausedField) {
                me.setPaused(paused = !!record.get(pausedField));
            } else {
                paused = me.getPaused();
            }

            if (!paused && startedField && !record.get(startedField)) {
                record.set(startedField, now);
            }

            if (!paused && !record.get(baseField)) {
                record.set(baseField, now);
            }

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
            refreshTask = me.refreshTask,
            record = me.getRecord(),
            baseField = me.getBaseField(),
            bankedField = me.getBankedField(),
            pausedField = me.getPausedField(),
            baseTime = record && record.get(baseField);

        if (record) {
            if (paused) {
                refreshTask.stop();

                if (baseTime) {
                    record.set(bankedField, record.get(bankedField) + (Date.now() - baseTime) / 1000);
                    record.set(baseField, null);
                }
            } else {
                if (!baseTime) {
                    record.set(baseField, new Date());
                }

                refreshTask.start();
            }

            if (pausedField) {
                record.set(pausedField, paused);
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

        me.setData({
            minutes: Math.floor(seconds / 60),
            seconds: Math.floor(seconds) % 60
        });
    }
});