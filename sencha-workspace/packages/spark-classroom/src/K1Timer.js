Ext.define('SparkClassroom.K1Timer', {
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
        ]
    }
});