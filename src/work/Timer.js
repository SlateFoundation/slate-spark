Ext.define('SparkClassroom.work.Timer', {
    extend: 'Ext.Component',
    xtype: 'spark-work-timer',
    cls: 'spark-work-timer',

    config: {
        data: {
            time: '0:00'
        },
        tpl: [
            '<div class="timer-icon"></div>',
            '<div class="timer-counter">{time}</div>'
        ]
    }
});