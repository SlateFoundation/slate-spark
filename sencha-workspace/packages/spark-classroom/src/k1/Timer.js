Ext.define('SparkClassroom.k1.Timer', {
    extend: 'SparkClassroom.work.Timer',
    xtype: 'spark-k1-timer',


    config: {
        tpl: [
            '<div class="timer-icon"></div>',
            '<div class="timer-play-pause"></div>',
            '<tpl if="!Ext.isEmpty(values.seconds)">',
                // TODO count hours
                '<div class="timer-counter">00:{minutes:leftPad(2, "0")}:{seconds:leftPad(2, "0")}</div>',
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
                    }
                }
            }
        }
    }
});