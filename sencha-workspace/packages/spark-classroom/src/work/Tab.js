/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.Tab', {
    extend: 'Ext.tab.Tab',
    xtype: 'spark-work-tab',

    config: {
        duration: null
    },

    titleTpl: [
        '{title}',
        '<tpl if="duration">',
            '<div class="spark-tab-timer">{duration}</div>',
        '</tpl>'
    ],

    updateDuration: function(duration) {
        var me = this,
            titleTpl = Ext.XTemplate.getTpl(me, 'titleTpl');

        me.setText(titleTpl.apply({
            title: me.getTitle(),
            duration: duration
        }));
    }
});
